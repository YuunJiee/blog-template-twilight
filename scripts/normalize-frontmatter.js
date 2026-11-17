/**
 * One-time script: normalize all _posts/*.md frontmatter
 * - Remove ai_qa, ai_summary, ai_questions fields
 * - Standardize field order
 * - Fix hello-world.md (excerpt → summary, inline tags)
 * Run: node scripts/normalize-frontmatter.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../_posts');

// Desired field order for serialization
const FIELD_ORDER = [
  'title', 'date', 'updated', 'draft',
  'difficulty', 'leetcode_id', 'plan',
  'tags', 'summary',
  'next_post',
];

function reorderFrontmatter(data) {
  const ordered = {};
  for (const key of FIELD_ORDER) {
    if (key in data) ordered[key] = data[key];
  }
  // Append any remaining keys not in FIELD_ORDER
  for (const key of Object.keys(data)) {
    if (!(key in ordered)) ordered[key] = data[key];
  }
  return ordered;
}

function serializeFrontmatter(data) {
  const lines = [];
  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined) continue;

    if (Array.isArray(val)) {
      // tags array
      lines.push(`${key}:`);
      for (const item of val) {
        if (typeof item === 'object') {
          // next_post-style objects inside arrays (ai_qa) — skip (already deleted)
          lines.push(`  - ${JSON.stringify(item)}`);
        } else {
          lines.push(`  - ${item}`);
        }
      }
    } else if (typeof val === 'object' && val !== null) {
      // next_post object
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(val)) {
        lines.push(`  ${k}: ${JSON.stringify(String(v))}`);
      }
    } else if (typeof val === 'boolean') {
      lines.push(`${key}: ${val}`);
    } else if (typeof val === 'number') {
      lines.push(`${key}: ${val}`);
    } else {
      const s = String(val);
      // Use single-quoted dates, otherwise quote if contains special chars
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        lines.push(`${key}: '${s}'`);
      } else if (s.includes(':') || s.includes('#') || s.includes('{') || s.includes('[') || s.includes("'") || s.startsWith('>') || s.startsWith('|')) {
        lines.push(`${key}: ${JSON.stringify(s)}`);
      } else {
        lines.push(`${key}: ${s}`);
      }
    }
  }
  return lines.join('\n');
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
let changed = 0;

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');

  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    console.error(`  SKIP (parse error): ${file} — ${e.message}`);
    continue;
  }

  const data = parsed.data;

  // ── Fix hello-world.md: excerpt → summary, tags already fine ──
  if (data.excerpt && !data.summary) {
    data.summary = data.excerpt;
    delete data.excerpt;
  }

  // ── Remove AI fields ──
  const removed = [];
  for (const field of ['ai_qa', 'ai_summary', 'ai_questions']) {
    if (field in data) { delete data[field]; removed.push(field); }
  }

  // ── Reorder fields ──
  const ordered = reorderFrontmatter(data);

  // ── Serialize ──
  const newFrontmatter = serializeFrontmatter(ordered);
  const newContent = `---\n${newFrontmatter}\n---\n${parsed.content}`;

  if (newContent !== raw) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    const note = removed.length ? ` [removed: ${removed.join(', ')}]` : '';
    console.log(`✓ ${file}${note}`);
    changed++;
  }
}

console.log(`\nDone. ${changed}/${files.length} files updated.`);
