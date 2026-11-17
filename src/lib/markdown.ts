/**
 * Shared Markdown processing pipeline factory.
 * Both posts.ts and projects.ts use this to avoid duplicating remark/rehype config.
 */
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Element, Text } from 'hast';
import Slugger from 'github-slugger';

// ─── Code line-number plugin ─────────────────────────────────────────────────

const rehypeCodeLineNumbers: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element, _index, parent) => {
    if (node.tagName !== 'code') return;
    if (!parent || (parent as Element).tagName !== 'pre') return;

    type Child = Element['children'][number];
    const lines: Child[][] = [[]];

    for (const child of node.children) {
      const current = lines[lines.length - 1]!;
      if (child.type === 'text') {
        const parts = (child as Text).value.split('\n');
        parts.forEach((part, i) => {
          if (i > 0) lines.push([]);
          if (part.length > 0) lines[lines.length - 1]!.push({ type: 'text', value: part } as Text);
        });
      } else {
        current.push(child);
      }
    }

    // Drop trailing empty line (code blocks almost always end with \n)
    while (lines.length > 0 && lines[lines.length - 1]!.length === 0) lines.pop();

    node.children = lines.map(lineChildren => ({
      type: 'element',
      tagName: 'span',
      properties: { className: ['code-line'] },
      children: lineChildren,
    }));
  });
};

// ─── Callout plugin ──────────────────────────────────────────────────────────

const CALLOUT_META = {
  NOTE:      'Note',
  TIP:       'Tip',
  WARNING:   'Warning',
  IMPORTANT: 'Important',
  CAUTION:   'Caution',
};

const rehypeCallouts: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'blockquote') return;

    const firstP = node.children.find(
      (c): c is Element => c.type === 'element' && (c as Element).tagName === 'p',
    ) as Element | undefined;
    if (!firstP) return;

    const firstText = firstP.children.find((c): c is Text => c.type === 'text');
    if (!firstText) return;

    const match = firstText.value.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\n?/);
    if (!match || !match[1]) return;

    const type = match[1] as keyof typeof CALLOUT_META;
    firstText.value = firstText.value.slice(match[0].length);
    // Remove paragraph if it's now empty
    if (firstP.children.every(c => c.type === 'text' && (c as Text).value.trim() === '')) {
      node.children = node.children.filter(c => c !== firstP);
    }

    node.tagName = 'div';
    node.properties = { className: ['callout', `callout-${type.toLowerCase()}`] };

    const title: Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['callout-title'] },
      children: [{ type: 'text', value: CALLOUT_META[type] }],
    };
    node.children.unshift(title);
  });
};

export interface MarkdownPipelineOptions {
  /** Enable KaTeX math rendering (remark-math + rehype-katex) */
  math?: boolean;
  /** Enable syntax highlighting via rehype-highlight */
  highlight?: boolean;
  /** Add id slugs and anchor links to headings */
  slug?: boolean;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Returns a configured remark processor ready to call .process(content).
 *
 * Usage:
 *   const html = (await createMarkdownPipeline({ math: true, highlight: true, slug: true })
 *     .process(markdownString)).toString();
 */
export function createMarkdownPipeline(options: MarkdownPipelineOptions = {}) {
  const { math = false, highlight = false, slug = false } = options;

  // The remark/rehype plugin chain produces a narrowing Processor generic at each .use()
  // call. TypeScript cannot track this through optional conditional branches, so `any`
  // is intentional here. The public API is stable and the return type is rehypeStringify's
  // Processor, which callers use via .process(content).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processor: any = remark().use(remarkGfm);

  if (math) processor = processor.use(remarkMath);

  processor = processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeCallouts);

  if (highlight) processor = processor.use(rehypeHighlight);
  processor = processor.use(rehypeCodeLineNumbers);
  if (math)      processor = processor.use(rehypeKatex);
  if (slug) {
    processor = processor
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' });
  }

  return processor.use(rehypeStringify);
}

/**
 * Synchronously parse a Markdown string and extract headings (h1–h3) as a TOC.
 * Uses a lightweight AST walk — no HTML rendering — so it's fast and separate
 * from the main pipeline pass.
 */
export function extractToc(markdownContent: string): TocItem[] {
  const slugger = new Slugger();
  const toc: TocItem[] = [];

  const tree = remark().use(remarkGfm).parse(markdownContent);

  visit(tree, 'heading', (node) => {
    if (node.depth <= 3) {
      // Extract plain text from all phrasing content children that carry a `value`
      const text = node.children
        .map((c) => ('value' in c && typeof (c as { value: unknown }).value === 'string'
          ? (c as { value: string }).value
          : ''))
        .join('');
      toc.push({ id: slugger.slug(text), text, level: node.depth });
    }
  });

  return toc;
}
