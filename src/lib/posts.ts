import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { createMarkdownPipeline, extractToc } from './markdown';
import { parseFrontmatter } from './fs-content';
import { PostType, CJK_READING_SPEED, LATIN_READING_SPEED, MS_PER_WEEK } from '@/config/constants';
export { PostType } from '@/config/constants';

// ─── Frontmatter schema (zod) ────────────────────────────────────────────────
// Validates every post at build time — missing required fields surface as errors
// instead of silent runtime undefined.
const PostFrontmatterSchema = z.object({
  title:       z.string(),
  date:        z.string(),
  updated:     z.string().optional(),
  draft:       z.boolean().optional().default(false),
  /**
   * Explicit routing type — determines whether the post lives at /blog/[id]
   * or /leetcode/[id].  If omitted, inferred from tags for backward compat,
   * but new posts should always set this field.
   */
  type:        z.enum(['blog', 'leetcode']).optional(),
  category:    z.enum(['notes', 'implementation', 'paper', 'til']).optional(),
  tags:        z.array(z.string()).default([]),
  summary:     z.string().optional(),
  difficulty:  z.enum(['Easy', 'Medium', 'Hard']).optional(),
  leetcode_id: z.number().optional(),
  plan:        z.string().optional(),
  next_post:   z.object({ title: z.string(), url: z.string() }).optional(),
  series:      z.string().optional(),
});

type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

// ─── Public types ────────────────────────────────────────────────────────────

/** Lightweight data used in list/index pages (no contentHtml). */
export interface PostData extends Omit<PostFrontmatter, 'type'> {
  id: string;
  /** Always set: either explicit from frontmatter or inferred from tags. */
  type: PostType;
  readingTime: string;
}

/** Full data used on the detail page. */
export interface FullPostData extends PostData {
  contentHtml: string;
  toc: { id: string; text: string; level: number }[];
}

const postsDirectory = path.join(process.cwd(), '_posts');

// ─── Private helpers ─────────────────────────────────────────────────────────

const parsePostFrontmatter = (fileName: string, data: unknown): PostFrontmatter =>
  parseFrontmatter(PostFrontmatterSchema, 'posts', fileName, data);

function inferPostType(data: PostFrontmatter): PostType {
  return data.type ?? (data.tags.includes('LeetCode') ? PostType.LEETCODE : PostType.BLOG);
}

function calculateReadingTime(content: string): string {
  // Count CJK characters (Chinese, Japanese, Korean) separately.
  // Reading speed: ~300 CJK chars/min, ~200 Latin words/min.
  const cjk = (content.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) || []).length;
  // Strip CJK from the text before splitting on whitespace to get Latin word count.
  const latinWords = content
    .replace(/[\u4e00-\u9fff\u3040-\u30ff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.ceil(cjk / CJK_READING_SPEED + latinWords / LATIN_READING_SPEED);
  return `${Math.max(1, minutes)} min read`;
}

/**
 * Read all published posts from _posts directory, sorted newest-first.
 * Only reads frontmatter (no full markdown processing), making it fast for list/index pages.
 * Wrapped with React.cache() so multiple callers in the same request share one disk read.
 */
export const getSortedPostsData = cache(function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const frontmatter = parsePostFrontmatter(fileName, matterResult.data);

    if (frontmatter.draft && process.env.INCLUDE_DRAFTS !== 'true') {
      return null;
    }

    return {
      id,
      ...frontmatter,
      type: inferPostType(frontmatter),
      readingTime: calculateReadingTime(matterResult.content),
    } satisfies PostData;
  }).filter(Boolean) as PostData[];

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
});

/** Frontmatter-only lookup — use for metadata / OG images instead of the full render. */
export function getPostById(id: string): PostData | undefined {
  return getSortedPostsData().find(p => p.id === id);
}

export function getPostsByType(type: PostType): PostData[] {
  return getSortedPostsData().filter(p => p.type === type);
}

/** Static params for generateStaticParams of a given route type. */
export function getPostIds(type: PostType) {
  return getPostsByType(type).map(p => ({ id: p.id }));
}

/**
 * Fully processes a single post: parses + validates frontmatter, builds TOC, and
 * renders HTML — all in a SINGLE remark pipeline pass.
 */
export async function getPostData(id: string): Promise<FullPostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const frontmatter = parsePostFrontmatter(`${id}.md`, matterResult.data);
  const toc = extractToc(matterResult.content);
  const contentHtml = (
    await createMarkdownPipeline({ math: true, highlight: true, slug: true })
      .process(matterResult.content)
  ).toString();

  return {
    id,
    contentHtml,
    toc,
    ...frontmatter,
    type: inferPostType(frontmatter),
    readingTime: calculateReadingTime(matterResult.content),
  };
}

/** Prev (older) / next (newer) posts within the same route type. */
export function getAdjacentPosts(currentId: string, type: PostType) {
  const posts = getPostsByType(type);
  const index = posts.findIndex(p => p.id === currentId);

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

// --- Related posts ---

export function getRelatedPosts(currentId: string, tags: string[], limit = 3): PostData[] {
  return getSortedPostsData()
    .filter(p => p.id !== currentId && p.type === PostType.BLOG)
    .map(p => ({ post: p, score: p.tags.filter(t => tags.includes(t)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

// --- Series helpers ---

export function getSeriesPosts(seriesName: string) {
  return getSortedPostsData()
    .filter(p => p.series === seriesName)
    .sort((a, b) => (a.date < b.date ? -1 : 1)); // chronological within series
}

/**
 * Counts tag frequency across posts and returns tags sorted by frequency descending.
 * Pass `exclude` to drop specific tags (e.g. the catch-all 'LeetCode' tag).
 */
export function aggregateTags(posts: PostData[], exclude: string[] = []): string[] {
  const counts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!exclude.includes(tag)) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

function buildDateCounts(posts: PostData[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const post of posts) {
    counts[post.date] = (counts[post.date] ?? 0) + 1;
  }
  return counts;
}

function calcStreaks(dateCounts: Record<string, number>): { currentStreak: number; longestStreak: number } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const weekKey = (d: Date) => {
    const sun = new Date(d);
    sun.setDate(d.getDate() - d.getDay());
    return `${sun.getFullYear()}-${pad(sun.getMonth() + 1)}-${pad(sun.getDate())}`;
  };

  const weeksWithPosts = new Set<string>();
  for (const date of Object.keys(dateCounts)) {
    const [y, m, day] = date.split('-').map(Number) as [number, number, number];
    weeksWithPosts.add(weekKey(new Date(y, m - 1, day)));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  cursor.setDate(today.getDate() - today.getDay());
  let currentStreak = 0;
  while (weeksWithPosts.has(weekKey(cursor))) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 7);
  }

  const sortedWeeks = [...weeksWithPosts].sort();
  let longestStreak = 0;
  let streak = 0;
  let prev: string | null = null;
  for (const wk of sortedWeeks) {
    if (prev) {
      const diff = (new Date(wk).getTime() - new Date(prev).getTime()) / MS_PER_WEEK;
      streak = diff === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    if (streak > longestStreak) longestStreak = streak;
    prev = wk;
  }

  return { currentStreak, longestStreak };
}

export function getHeatmapData() {
  const blogPosts = getSortedPostsData().filter(p => p.type !== PostType.LEETCODE);
  const dateCounts = buildDateCounts(blogPosts);
  const thisYear   = new Date().getFullYear();
  const yearPosts  = blogPosts.filter(p => p.date.startsWith(String(thisYear))).length;
  const { currentStreak, longestStreak } = calcStreaks(dateCounts);
  return { dateCounts, totalPosts: blogPosts.length, yearPosts, currentStreak, longestStreak };
}
