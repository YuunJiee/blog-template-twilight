import Link from 'next/link';
import { TagPill } from '@/components/page-header';

interface RelatedPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  summary?: string;
  readingTime: string;
}

export function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-bold">相關文章</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
          >
            <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
            <span className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-link">
              {post.title}
            </span>
            {post.summary && (
              <span className="line-clamp-2 text-sm text-muted-foreground">{post.summary}</span>
            )}
            <div className="mt-auto flex flex-wrap gap-1 pt-1">
              {post.tags.slice(0, 2).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
