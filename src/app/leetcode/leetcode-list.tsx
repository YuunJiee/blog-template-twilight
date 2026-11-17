'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PaginationComponent } from '@/components/pagination';
import { TagPill } from '@/components/page-header';
import { DIFFICULTY_CONFIG, DIFFICULTIES, type Difficulty, LC_POSTS_PER_PAGE } from '@/config/constants';
import { type PostData } from '@/lib/posts';
import { useListFilters } from '@/hooks/use-list-filters';

type StudyPlan = {
  key: string;
  name: string;
  description: string;
  total: number;
};

interface LeetCodeListProps {
  posts: PostData[];
  allTopicTags: string[];
  studyPlans: StudyPlan[];
  completedPerPlan: Record<string, number>;
  difficultyCounts: Record<string, number>;
}

export function LeetCodeList({
  posts,
  allTopicTags,
  studyPlans,
  completedPerPlan,
  difficultyCounts,
}: LeetCodeListProps) {
  const {
    searchParamsHook,
    primaryValue: selectedDifficulty,
    currentTags,
    currentPage,
    togglePrimary: toggleDifficulty,
    toggleTag,
    clearAll,
    hasFilter,
  } = useListFilters({ basePath: '/leetcode', primaryKey: 'difficulty' });

  const filteredPosts = posts.filter((post) => {
    if (selectedDifficulty && post.difficulty !== selectedDifficulty) return false;
    if (currentTags.length > 0 && !post.tags.some((t) => currentTags.includes(t))) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / LC_POSTS_PER_PAGE);
  const postsForCurrentPage = filteredPosts.slice(
    (currentPage - 1) * LC_POSTS_PER_PAGE,
    currentPage * LC_POSTS_PER_PAGE,
  );

  return (
    <div className="space-y-8">
      {/* ── Stat cards (click to filter by difficulty) ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <button
          type="button"
          onClick={clearAll}
          className={cn(
            'rounded-2xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md',
            !selectedDifficulty ? 'border-accent' : 'border-border',
          )}
        >
          <div className="text-3xl font-bold">{posts.length}</div>
          <div className="mt-1 text-sm text-muted-foreground">已解題數</div>
        </button>
        {DIFFICULTIES.map((diff) => {
          const active = selectedDifficulty === diff;
          return (
            <button
              key={diff}
              type="button"
              onClick={() => toggleDifficulty(diff)}
              aria-pressed={active}
              className={cn(
                'rounded-2xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md',
                active ? 'border-accent' : 'border-border',
              )}
            >
              <div className={cn('text-3xl font-bold', DIFFICULTY_CONFIG[diff].color)}>
                {difficultyCounts[diff] ?? 0}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{diff}</div>
            </button>
          );
        })}
      </div>

      {/* ── Study plans ── */}
      {studyPlans.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {studyPlans.map((plan) => {
            const completed = completedPerPlan[plan.key] ?? 0;
            const pct = Math.round((completed / plan.total) * 100);
            return (
              <div key={plan.key} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <span className="font-mono text-sm text-muted-foreground">{completed}/{plan.total}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Topic tags ── */}
      {allTopicTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {allTopicTags.slice(0, 20).map((tag) => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)} aria-pressed={currentTags.includes(tag)}>
              <TagPill active={currentTags.includes(tag)} className="cursor-pointer hover:opacity-80">{tag}</TagPill>
            </button>
          ))}
          {hasFilter && (
            <button type="button" onClick={clearAll} className="ml-2 text-xs text-link hover:underline">
              清除篩選
            </button>
          )}
        </div>
      )}

      {/* ── Problem list ── */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {postsForCurrentPage.length > 0 ? (
          postsForCurrentPage.map((post) => {
            const diff = post.difficulty as Difficulty | undefined;
            const topicTags = post.tags.filter((t) => t !== 'LeetCode');
            return (
              <Link
                key={post.id}
                href={`/leetcode/${post.id}`}
                className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-muted"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {post.leetcode_id ? `#${post.leetcode_id}` : '—'}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium transition-colors group-hover:text-link">{post.title}</div>
                  {topicTags.length > 0 && (
                    <div className="mt-1 hidden gap-1 sm:flex">
                      {topicTags.slice(0, 3).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {diff && (
                    <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', DIFFICULTY_CONFIG[diff].badge)}>
                      {diff}
                    </span>
                  )}
                  <span className="hidden font-mono text-sm text-muted-foreground sm:block">{post.date}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-muted-foreground">沒有符合條件的題目</p>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              查看全部
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          basePath="/leetcode"
          searchParams={Object.fromEntries(searchParamsHook.entries())}
        />
      )}
    </div>
  );
}
