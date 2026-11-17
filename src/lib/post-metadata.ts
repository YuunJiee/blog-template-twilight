import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { PostData } from './posts';

/** Shared generateMetadata payload for /blog/[id] and /leetcode/[id]. */
export function buildPostMetadata(post: PostData | undefined, basePath: string): Metadata {
  if (!post) return { title: 'Post Not Found' };

  const url = `${siteConfig.url}${basePath}/${post.id}`;
  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
    alternates: { canonical: url },
  };
}
