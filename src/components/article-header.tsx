import { ReactNode } from 'react';
import { TagPill } from '@/components/page-header';
import type { PostData } from '@/lib/posts';

interface ArticleHeaderProps {
  post: PostData;
  tags: string[];
  /** Optional row rendered above the title (e.g. LeetCode number + difficulty). */
  eyebrow?: ReactNode;
}

export function ArticleHeader({ post, tags, eyebrow }: ArticleHeaderProps) {
  return (
    <header className="mb-10 border-b border-border pb-8 text-center">
      {eyebrow}
      <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">{post.title}</h1>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <time dateTime={post.date}>{post.date}</time>
        <span aria-hidden className="text-border">|</span>
        <span>{post.readingTime}</span>
        {post.updated && post.updated !== post.date && (
          <>
            <span aria-hidden className="text-border">|</span>
            <span>更新於 {post.updated}</span>
          </>
        )}
      </div>
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {tags.map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
        </div>
      )}
      {post.summary && (
        <p className="mx-auto mt-6 max-w-2xl text-left text-muted-foreground leading-relaxed">
          {post.summary}
        </p>
      )}
    </header>
  );
}
