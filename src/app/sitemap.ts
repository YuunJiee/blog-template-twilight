import { MetadataRoute } from 'next';
import { getSortedPostsData, PostType } from '@/lib/posts';
import { getSortedProjectsData } from '@/lib/projects';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;
    const posts = getSortedPostsData();

    const postsUrls = posts.map((post) => {
        const isLeetCode = post.type === PostType.LEETCODE;
        return {
            url: isLeetCode ? `${baseUrl}/leetcode/${post.id}` : `${baseUrl}/blog/${post.id}`,
            lastModified: new Date(post.updated ?? post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        };
    });

    const projectUrls = getSortedProjectsData().map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...(siteConfig.showLeetCode ? [{
            url: `${baseUrl}/leetcode`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }] : []),
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/changelog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        ...postsUrls,
        ...projectUrls,
    ];
}
