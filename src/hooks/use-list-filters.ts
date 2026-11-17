'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/lib/filter-state';

interface UseListFiltersOptions {
  basePath: string;
  primaryKey?: string;
}

export function useListFilters({ basePath, primaryKey = 'category' }: UseListFiltersOptions) {
  const router           = useRouter();
  const searchParamsHook = useSearchParams();

  const state = FilterState.fromSearchParams(
    new URLSearchParams(searchParamsHook.toString()),
    primaryKey,
  );

  const push = (next: FilterState) => {
    const qs = next.toSearchParams(primaryKey).toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return {
    searchParamsHook,
    primaryValue: state.primaryValue,
    currentTags:  state.tags,
    currentPage:  state.page,
    hasFilter:    state.hasFilter,
    togglePrimary: (value: string) => push(state.withPrimary(value)),
    toggleTag:     (tag: string)   => push(state.withTag(tag)),
    clearTags:     ()              => push(state.withoutTags()),
    clearAll:      ()              => router.push(basePath),
  };
}
