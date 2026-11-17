import { getSortedPostsData, aggregateTags, PostType } from '@/lib/posts';
import { LeetCodeList } from './leetcode-list';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { siteConfig } from '@/config/site';

export const metadata = {
    title: 'LeetCode 題解',
    description: '刷題筆記與解題思路，記錄 LeetCode 每一道題的思考過程。',
};

// Study plan definitions: key -> { name, total }
const PLAN_DEFS: Record<string, { name: string; description: string; total: number }> = {
    LC75: { name: 'LeetCode 75', description: '精選 75 題，覆蓋核心資料結構與演算法，適合面試備考。', total: 75 },
    Blind75: { name: 'Blind 75', description: 'Blind 75 — 業界最常被推薦的面試刷題清單。', total: 75 },
    NeetCode150: { name: 'NeetCode 150', description: 'NeetCode 150 — 更全面的刷題計劃，覆蓋更廣的題型。', total: 150 },
};

export default function LeetCodePage() {
    // The list page is opt-in; individual /leetcode/<id> posts keep working.
    if (!siteConfig.showLeetCode) notFound();

    const allPosts = getSortedPostsData();

    // Only leetcode-type posts
    const lcPosts = allPosts.filter(p => p.type === PostType.LEETCODE);

    // Difficulty counts
    const difficultyCounts: Record<string, number> = {};
    lcPosts.forEach(p => {
        if (p.difficulty) {
            difficultyCounts[p.difficulty] = (difficultyCounts[p.difficulty] ?? 0) + 1;
        }
    });

    // Completed per study plan
    const completedPerPlan: Record<string, number> = {};
    lcPosts.forEach(p => {
        if (p.plan) {
            completedPerPlan[p.plan] = (completedPerPlan[p.plan] ?? 0) + 1;
        }
    });

    // Study plans that have at least one completed post
    const studyPlans = Object.keys(completedPerPlan)
        .filter(key => key in PLAN_DEFS)
        .map(key => ({
            key,
            name: PLAN_DEFS[key]!.name,
            description: PLAN_DEFS[key]!.description,
            total: PLAN_DEFS[key]!.total,
        }));

    const allTopicTags = aggregateTags(lcPosts, ['LeetCode']);

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
            <PageHeader title="LeetCode 題解" description="刷題筆記與解題思路。" />
            <Suspense>
                <LeetCodeList
                    posts={lcPosts}
                    allTopicTags={allTopicTags}
                    studyPlans={studyPlans}
                    completedPerPlan={completedPerPlan}
                    difficultyCounts={difficultyCounts}
                />
            </Suspense>
        </div>
    );
}
