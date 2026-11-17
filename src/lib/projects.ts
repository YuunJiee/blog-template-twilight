import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { createMarkdownPipeline } from './markdown';
import { parseFrontmatter } from './fs-content';

// ─── Frontmatter schema (zod) ──────────────────────────────────────────────
const ProjectFrontmatterSchema = z.object({
  title:     z.string(),
  summary:   z.string(),
  image:     z.string().optional(),
  tags:      z.array(z.string()).default([]),
  liveUrl:   z.url().optional(),
  githubUrl: z.url().optional(),
  /** Display order on /projects (ascending). Projects without it go last, by slug. */
  order:     z.number().optional(),
});

type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

// ─── Public types ──────────────────────────────────────────────────────────
export type Project = ProjectFrontmatter & {
  slug: string;
  contentHtml: string;
};

export type ProjectPreview = Omit<Project, 'contentHtml'>;

const projectsDirectory = path.join(process.cwd(), '_projects');

const parseProjectFrontmatter = (fileName: string, data: unknown): ProjectFrontmatter =>
  parseFrontmatter(ProjectFrontmatterSchema, 'projects', fileName, data);

/**
 * Returns all project previews (no contentHtml), sorted by `order`.
 * Wrapped with React.cache() so multiple callers in the same request share one disk read.
 */
export const getSortedProjectsData = cache(function getSortedProjectsData(): ProjectPreview[] {
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(projectsDirectory, fileName);
      const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
      return { slug, ...parseProjectFrontmatter(fileName, data) };
    })
    .sort((a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) || a.slug.localeCompare(b.slug),
    );
});

/** Static params for generateStaticParams. */
export function getAllProjectSlugs() {
  return getSortedProjectsData().map((p) => ({ slug: p.slug }));
}

export async function getProjectData(slug: string): Promise<Project> {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

  const frontmatter = parseProjectFrontmatter(`${slug}.md`, data);
  const contentHtml = (
    await createMarkdownPipeline({ highlight: true }).process(content)
  ).toString();

  return { slug, contentHtml, ...frontmatter };
}