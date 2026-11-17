export const DIFFICULTY_CONFIG = {
  Easy:   { label: 'Easy',   code: 'E', color: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  Medium: { label: 'Medium', code: 'M', color: 'text-amber-600 dark:text-amber-400',     badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'       },
  Hard:   { label: 'Hard',   code: 'H', color: 'text-rose-600 dark:text-rose-400',       badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'           },
} as const;

export type Difficulty = keyof typeof DIFFICULTY_CONFIG;

export const DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG) as Difficulty[];

export const PostType = {
  BLOG:     'blog',
  LEETCODE: 'leetcode',
} as const;
export type PostType = typeof PostType[keyof typeof PostType];

export const BLOG_POSTS_PER_PAGE = 10;
export const LC_POSTS_PER_PAGE   = 20;

// Reading time estimation
export const CJK_READING_SPEED   = 300; // characters per minute
export const LATIN_READING_SPEED = 200; // words per minute

// Time
export const MS_PER_WEEK = 604_800_000;

// Contact form
export const CONTACT_MESSAGE_MAX_LENGTH = 2000;

// OpenGraph image dimensions (standard 1.91:1 ratio)
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
