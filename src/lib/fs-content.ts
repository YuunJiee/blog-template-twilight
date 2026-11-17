import { z } from 'zod';

/**
 * Validates raw frontmatter data against a Zod schema.
 * Throws a consistent, build-time error message on failure so all content
 * types (posts, projects, changelog) surface bad frontmatter identically.
 */
export function parseFrontmatter<T>(
  schema: z.ZodSchema<T>,
  context: string,
  fileName: string,
  data: unknown,
): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const errs = parsed.error.issues
      .map(i => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`[${context}] Invalid frontmatter in "${fileName}":\n${errs}`);
  }
  return parsed.data;
}
