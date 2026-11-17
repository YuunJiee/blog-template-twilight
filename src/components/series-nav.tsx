import Link from 'next/link';
import { Layers } from 'lucide-react';

interface SeriesPost {
  id: string;
  title: string;
}

interface SeriesNavProps {
  seriesName: string;
  posts: SeriesPost[];
  currentId: string;
}

export function SeriesNav({ seriesName, posts, currentId }: SeriesNavProps) {
  return (
    <div className="mb-10 rounded-2xl border border-border bg-secondary/50 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
        <Layers className="h-4 w-4 text-link" />
        系列文章：{seriesName}
      </div>
      <ol className="flex flex-col gap-1.5 text-sm">
        {posts.map((post, i) => {
          const isCurrent = post.id === currentId;
          return (
            <li key={post.id} className="flex items-baseline gap-2">
              <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">{i + 1}.</span>
              {isCurrent ? (
                <span className="font-semibold text-link" aria-current="page">{post.title}</span>
              ) : (
                <Link href={`/blog/${post.id}`} className="text-muted-foreground hover:text-link">
                  {post.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
