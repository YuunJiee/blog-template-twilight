import RSS from 'rss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSortedPostsData, PostType } from '@/lib/posts';
import { siteConfig } from '@/config/site';

const postsDirectory = path.join(process.cwd(), '_posts');

// Content only changes on deploy — render once at build time.
export const dynamic = 'force-static';

export async function GET() {
    const feed = new RSS({
        title: siteConfig.name,
        description: siteConfig.description,
        site_url: siteConfig.url,
        feed_url: `${siteConfig.url}/feed.xml`,
        language: siteConfig.lang,
        pubDate: new Date(),
        copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author.name}`,
        // Declare the content namespace for content:encoded
        custom_namespaces: {
            content: 'http://purl.org/rss/1.0/modules/content/',
        },
    });

    const posts = getSortedPostsData();

    posts.forEach((post) => {
        const url = `${siteConfig.url}/${post.type === PostType.LEETCODE ? 'leetcode' : 'blog'}/${post.id}`;

        // Read raw markdown body for content:encoded
        let rawBody = '';
        try {
            const filePath = path.join(postsDirectory, `${post.id}.md`);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            rawBody = matter(fileContents).content.trim();
        } catch {
            // If reading fails, fall back to summary only
        }

        feed.item({
            title: post.title,
            description: post.summary ?? '',
            url,
            date: post.updated ?? post.date,
            author: siteConfig.author.name,
            categories: post.tags,
            custom_elements: rawBody
                ? [{ 'content:encoded': { _cdata: rawBody } }]
                : [],
        });
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml',
            // Cache for 1 hour on CDN
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
