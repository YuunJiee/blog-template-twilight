'use client';

import Link from 'next/link';
import { ArrowRight, Folder, Tag, X } from 'lucide-react';
import { PaginationComponent } from '@/components/pagination';
import { TagPill } from '@/components/page-header';
import { cn } from '@/lib/utils';
import { BLOG_POSTS_PER_PAGE } from '@/config/constants';
import { type PostData } from '@/lib/posts';
import { useListFilters } from '@/hooks/use-list-filters';

type Category = { id: string; label: string };

interface BlogPostsProps {
  posts: PostData[];
  allTags: string[];
  categories: Category[];
}

export function BlogPosts({ posts, allTags, categories }: BlogPostsProps) {
  const {
    searchParamsHook,
    primaryValue: currentCategory,
    currentTags,
    currentPage,
    toggleTag,
    clearAll: clearFilters,
    hasFilter,
  } = useListFilters({ basePath: '/blog', primaryKey: 'category' });

  const activeCategory = currentCategory || 'all';

  let filteredPosts = [...posts];
  if (activeCategory !== 'all') {
    filteredPosts = filteredPosts.filter((p) => p.category === activeCategory);
  }
  if (currentTags.length > 0) {
    filteredPosts = filteredPosts.filter((p) => p.tags.some((t) => currentTags.includes(t)));
  }

  const totalPages = Math.ceil(filteredPosts.length / BLOG_POSTS_PER_PAGE);
  const postsForCurrentPage = filteredPosts.slice(
    (currentPage - 1) * BLOG_POSTS_PER_PAGE,
    currentPage * BLOG_POSTS_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
      {/* ── Sidebar (first on mobile) ── */}
      <aside className="space-y-8 lg:order-2">
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Folder className="h-4 w-4 text-link" /> 文章分類
          </h2>
          <div className="flex flex-wrap gap-1 lg:flex-col">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={cat.id === 'all' ? '/blog' : `/blog?category=${cat.id}`}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-secondary font-medium text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {cat.label}
                  {active && <span className="ml-3 h-1.5 w-1.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </div>
        </div>

        {allTags.length > 0 && (
          <div>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Tag className="h-4 w-4 text-link" /> 熱門標籤
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {allTags.slice(0, 20).map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)} aria-pressed={currentTags.includes(tag)}>
                  <TagPill active={currentTags.includes(tag)} className="cursor-pointer hover:opacity-80">
                    {tag}
                  </TagPill>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">點標籤可以多選</p>
          </div>
        )}
      </aside>

      {/* ── Post list ── */}
      <div className="lg:order-1">
        {hasFilter && (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{filteredPosts.length} 篇符合</span>
            {currentTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
              >
                {tag} <X className="h-3 w-3" />
              </button>
            ))}
            <button type="button" onClick={clearFilters} className="text-xs text-link underline-offset-4 hover:underline">
              清除篩選
            </button>
          </div>
        )}

        {postsForCurrentPage.length > 0 ? (
          <div className="space-y-5">
            {postsForCurrentPage.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-link">
                    {post.title}
                  </h3>
                  <span className="shrink-0 font-mono text-sm text-muted-foreground">{post.date}</span>
                </div>
                {post.summary && (
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{post.summary}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
                  )}
                  <span className="ml-auto flex items-center text-sm font-medium text-link opacity-0 transition-all group-hover:opacity-100">
                    閱讀 <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="mb-4 text-lg text-muted-foreground">沒有找到符合條件的文章</p>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              查看所有文章
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12">
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              basePath="/blog"
              searchParams={Object.fromEntries(searchParamsHook.entries())}
            />
          </div>
        )}
      </div>
    </div>
  );
}
