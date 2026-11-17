import { getPostById, getPostIds, PostType } from '@/lib/posts';
import { siteConfig } from '@/config/site';
import { OG_IMAGE_SIZE } from '@/config/constants';
import { renderPostOgImage, OgPill, PILL_INDIGO } from '@/components/post-og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

// Pre-generate OG images for all blog posts at build time
export async function generateStaticParams() {
  return getPostIds(PostType.BLOG);
}

export default async function PostOGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);

  return renderPostOgImage({
    title: post?.title ?? siteConfig.name,
    tags: post?.tags.slice(0, 4) ?? [],
    date: post?.date ?? '',
    bottomRight: <OgPill color={PILL_INDIGO}>Blog Post</OgPill>,
  });
}
