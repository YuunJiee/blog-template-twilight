import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight, Home } from 'lucide-react';
import parse, { Element, domToReact, DOMNode } from 'html-react-parser';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Comments } from '@/components/comments';
import { CopyCodeListener } from '@/components/copy-code-listener';
import { TocNav } from '@/components/toc-nav';
import { ReadingProgressBar } from '@/components/reading-progress-bar';
import { ShareButtons } from '@/components/share-buttons';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface AdjacentPost {
  id: string;
  title: string;
}

export interface ArticleLayoutProps {
  /** Breadcrumb parent, e.g. { href: '/blog', label: '文章' } */
  parent: { href: string; label: string };
  header: React.ReactNode;
  contentHtml: string;
  postTitle: string;
  seriesNav?: React.ReactNode;
  relatedPosts?: React.ReactNode;
  nextPost?: { url: string; title: string } | null;
  adjacentPrev?: AdjacentPost | null;
  adjacentNext?: AdjacentPost | null;
  adjacentHrefPrefix: string;
  toc?: TocItem[];
}

export function ArticleLayout({
  parent,
  header,
  contentHtml,
  postTitle,
  seriesNav,
  relatedPosts,
  nextPost,
  adjacentPrev,
  adjacentNext,
  adjacentHrefPrefix,
  toc,
}: ArticleLayoutProps) {
  const hasToc = !!toc && toc.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <ReadingProgressBar />

      {/* Breadcrumbs */}
      <nav aria-label="麵包屑" className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" aria-label="首頁" className="hover:text-link"><Home className="h-4 w-4" /></Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={parent.href} className="hover:text-link">{parent.label}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-foreground">{postTitle}</span>
      </nav>

      <div className={hasToc ? 'grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px]' : 'mx-auto max-w-3xl'}>
        <article className="min-w-0">
          <CopyCodeListener />
          {header}
          {seriesNav}

          <div className="manual-prose">
            {parse(contentHtml, {
              replace: (domNode) => {
                if (domNode instanceof Element && domNode.name === 'img') {
                  const { src, alt, class: className } = domNode.attribs;
                  return <ImageWithFallback src={src} alt={alt} className={className} />;
                }
                if (domNode instanceof Element && domNode.name === 'table') {
                  return (
                    <div className="my-6 overflow-x-auto">
                      <table>{domToReact(domNode.children as DOMNode[])}</table>
                    </div>
                  );
                }
                if (domNode instanceof Element && domNode.name === 'pre') {
                  const codeChild = domNode.children.find(
                    (c): c is Element => c instanceof Element && c.name === 'code',
                  );
                  const lang = codeChild?.attribs?.class
                    ?.split(' ')
                    .find((c) => c.startsWith('language-'))
                    ?.replace('language-', '');
                  return (
                    <div className="relative">
                      {lang && (
                        <span className="pointer-events-none absolute top-2.5 left-4 z-10 select-none font-mono text-[0.7rem] uppercase tracking-wider text-[#9a9ab8]">
                          {lang}
                        </span>
                      )}
                      <pre>{domToReact(domNode.children as DOMNode[])}</pre>
                    </div>
                  );
                }
              },
            })}
          </div>

          {/* Next chapter (frontmatter next_post) */}
          {nextPost && (
            <Link
              href={nextPost.url}
              className="group mt-10 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/60 hover:shadow-md"
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold text-link">下一章</span>
                <p className="truncate font-semibold transition-colors group-hover:text-link">{nextPost.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {/* Share */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <ShareButtons title={postTitle} />
          </div>

          {/* Prev / next */}
          {(adjacentPrev || adjacentNext) && (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {adjacentPrev ? (
                <Link
                  href={`${adjacentHrefPrefix}${adjacentPrev.id}`}
                  className="group flex flex-col gap-1 rounded-2xl border border-border p-4 transition-colors hover:border-accent/60 hover:bg-muted"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" /> 上一篇
                  </span>
                  <span className="line-clamp-1 font-medium group-hover:text-link">{adjacentPrev.title}</span>
                </Link>
              ) : <div className="hidden md:block" />}
              {adjacentNext && (
                <Link
                  href={`${adjacentHrefPrefix}${adjacentNext.id}`}
                  className="group flex flex-col items-end gap-1 rounded-2xl border border-border p-4 text-right transition-colors hover:border-accent/60 hover:bg-muted"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    下一篇 <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="line-clamp-1 font-medium group-hover:text-link">{adjacentNext.title}</span>
                </Link>
              )}
            </div>
          )}

          {relatedPosts}

          <div className="mt-12">
            <Comments />
          </div>
        </article>

        {hasToc && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">目錄</h2>
              <TocNav toc={toc} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
