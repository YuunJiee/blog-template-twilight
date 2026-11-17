import { Suspense } from 'react';
import { getSortedPostsData, aggregateTags, PostType } from '@/lib/posts';
import { PageHeader } from '@/components/page-header';
import { BlogPosts } from './blog-posts';

const CATEGORIES = [
  { id: 'all',            label: '全部文章' },
  { id: 'notes',          label: '學習筆記' },
  { id: 'implementation', label: '實作筆記' },
  { id: 'til',            label: 'TIL'      },
  { id: 'paper',          label: '論文閱讀' },
];

export const metadata = {
  title: '文章與筆記',
  description: '技術文章、學習筆記與實作心得。',
};

export default function BlogIndexPage() {
  // LeetCode posts have their own /leetcode route — exclude here
  const allPosts = getSortedPostsData().filter((post) => post.type === PostType.BLOG);
  const allTags  = aggregateTags(allPosts);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <PageHeader title="文章與筆記" description="技術文章、學習筆記與實作心得。" />
      <Suspense>
        <BlogPosts posts={allPosts} allTags={allTags} categories={CATEGORIES} />
      </Suspense>
    </div>
  );
}
