import { getPostData, getPostById, getPostIds, getAdjacentPosts, getSeriesPosts, getRelatedPosts, PostType } from '@/lib/posts';
import { buildPostMetadata } from '@/lib/post-metadata';
import { redirect } from 'next/navigation';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleHeader } from '@/components/article-header';
import { SeriesNav } from '@/components/series-nav';
import { RelatedPosts } from '@/components/related-posts';

export async function generateStaticParams() {
  return getPostIds(PostType.BLOG);
}

// Unknown ids 404 before reaching the page, so no not-found handling is needed below.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildPostMetadata(getPostById(id), '/blog');
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);
  if (postData.type === PostType.LEETCODE) redirect(`/leetcode/${id}`);

  const adjacentPosts = getAdjacentPosts(id, PostType.BLOG);

  const seriesNav = postData.series ? (
    <SeriesNav
      seriesName={postData.series}
      posts={getSeriesPosts(postData.series)}
      currentId={id}
    />
  ) : null;

  const related = getRelatedPosts(id, postData.tags);
  const relatedPosts = related.length > 0 ? <RelatedPosts posts={related} /> : null;

  return (
    <ArticleLayout
      parent={{ href: '/blog', label: '文章' }}
      header={<ArticleHeader post={postData} tags={postData.tags} />}
      contentHtml={postData.contentHtml}
      postTitle={postData.title}
      seriesNav={seriesNav}
      relatedPosts={relatedPosts}
      nextPost={postData.next_post}
      adjacentPrev={adjacentPosts.prev}
      adjacentNext={adjacentPosts.next}
      adjacentHrefPrefix="/blog/"
      toc={postData.toc}
    />
  );
}
