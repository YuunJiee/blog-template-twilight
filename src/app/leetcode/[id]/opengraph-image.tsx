import { getPostById, getPostIds, PostType } from '@/lib/posts';
import { siteConfig } from '@/config/site';
import { OG_IMAGE_SIZE, type Difficulty } from '@/config/constants';
import { renderPostOgImage, OgPill, PILL_AMBER, type PillColor } from '@/components/post-og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  return getPostIds(PostType.LEETCODE);
}

const DIFFICULTY_COLOR: Record<Difficulty, PillColor> = {
  Easy:   { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399' },
  Medium: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24' },
  Hard:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#f87171' },
};

export default async function LeetCodeOGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);

  return renderPostOgImage({
    title: post?.title ?? siteConfig.name,
    tags: post?.tags.filter(t => t !== 'LeetCode').slice(0, 3) ?? [],
    date: post?.date ?? '',
    topRight: <OgPill color={PILL_AMBER}>LeetCode</OgPill>,
    eyebrow: post?.leetcode_id && (
      <span style={{ color: '#475569', fontSize: '22px', fontWeight: 600, letterSpacing: '0.05em' }}>
        #{post.leetcode_id}
      </span>
    ),
    bottomRight: post?.difficulty && (
      <OgPill color={DIFFICULTY_COLOR[post.difficulty]}>{post.difficulty}</OgPill>
    ),
  });
}
