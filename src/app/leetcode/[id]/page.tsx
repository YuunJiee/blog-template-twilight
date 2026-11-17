import { getPostData, getPostById, getPostIds, getAdjacentPosts, PostType } from '@/lib/posts';
import { buildPostMetadata } from '@/lib/post-metadata';
import { redirect } from 'next/navigation';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleHeader } from '@/components/article-header';
import { DIFFICULTY_CONFIG } from '@/config/constants';

export async function generateStaticParams() {
  return getPostIds(PostType.LEETCODE);
}

// Unknown ids 404 before reaching the page, so no not-found handling is needed below.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildPostMetadata(getPostById(id), '/leetcode');
}

export default async function LeetCodePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);
  if (postData.type !== PostType.LEETCODE) redirect(`/blog/${id}`);

  const adjacentPosts = getAdjacentPosts(id, PostType.LEETCODE);
  const diffCfg = postData.difficulty ? DIFFICULTY_CONFIG[postData.difficulty] : null;

  const eyebrow = (
    <div className="mb-3 flex items-center justify-center gap-2">
      {postData.leetcode_id && (
        <span className="font-mono text-sm text-muted-foreground">#{postData.leetcode_id}</span>
      )}
      {diffCfg && (
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${diffCfg.badge}`}>
          {diffCfg.label}
        </span>
      )}
    </div>
  );

  return (
    <ArticleLayout
      parent={{ href: '/leetcode', label: 'LeetCode' }}
      header={
        <ArticleHeader
          post={postData}
          tags={postData.tags.filter(t => t !== 'LeetCode')}
          eyebrow={eyebrow}
        />
      }
      contentHtml={postData.contentHtml}
      postTitle={postData.title}
      nextPost={postData.next_post}
      adjacentPrev={adjacentPosts.prev}
      adjacentNext={adjacentPosts.next}
      adjacentHrefPrefix="/leetcode/"
      toc={postData.toc}
    />
  );
}
