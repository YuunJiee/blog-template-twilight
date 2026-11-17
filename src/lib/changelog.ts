import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { parseFrontmatter } from './fs-content';

const changelogDirectory = path.join(process.cwd(), '_changelog');

// ─── Schema ──────────────────────────────────────────────────────────────────

const ChangeType = z.enum(['feat', 'fix', 'perf', 'refactor', 'docs', 'chore', 'style']);

const ChangelogSchema = z.object({
  date:        z.string(),
  version:     z.string(),
  title:       z.string(),
  description: z.string().optional(),
  changes:     z.array(z.object({
    type:    ChangeType,
    content: z.string(),
  })).optional(),
});

export type ChangelogEntry = z.infer<typeof ChangelogSchema>;

// ─── Data access ─────────────────────────────────────────────────────────────

/**
 * Read all changelog entries from `_changelog/*.md`, validate with zod,
 * and return them sorted newest-first (by semantic version).
 *
 * To add a new entry, create `_changelog/<version>.md` with the frontmatter
 * fields above — no TypeScript changes needed.
 */
export const getChangelogData = cache(function getChangelogData(): ChangelogEntry[] {
  const fileNames = fs.readdirSync(changelogDirectory).filter(f => f.endsWith('.md'));

  const entries = fileNames.map(fileName => {
    const fullPath = path.join(changelogDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return parseFrontmatter(ChangelogSchema, 'changelog', fileName, data);
  });

  // Sort newest first by semantic version (e.g. v2.1.0 > v1.8.1)
  return entries.sort((a, b) => {
    const va = a.version.replace(/^v/, '').split('.').map(Number);
    const vb = b.version.replace(/^v/, '').split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const diff = (vb[i] ?? 0) - (va[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  });
});
