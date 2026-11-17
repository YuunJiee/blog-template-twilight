/**
 * ─────────────────────────────────────────────
 *  Site Configuration — edit this file to
 *  customise the blog for your own use.
 * ─────────────────────────────────────────────
 */

export const siteConfig = {
  // ── Identity ──────────────────────────────
  /** Displayed in navbar, footer, browser tab, and OG tags. */
  name: "My Twilight Blog",

  /** Short tagline shown in the home hero. */
  description: "技術筆記、專案與開發雜記",

  /**
   * Canonical URL of your deployed site.
   * Override with NEXT_PUBLIC_SITE_URL env var (no trailing slash).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",

  // ── Author ────────────────────────────────
  author: {
    /** Display name (home "About me", about page heading, footer, SEO). */
    name: "Your Name",
    /** One line under your name on the about page. Set "" to hide. */
    affiliation: "Software Engineer · Your City",
    /** Avatar image under /public. */
    avatar: "/images/avatar.svg",
    /** GitHub username. Set "" to hide. */
    github: "your-github",
    /** LinkedIn path after linkedin.com/, e.g. "in/your-name". Set "" to hide. */
    linkedin: "",
    /** Public email. Set "" to hide. */
    email: "",
  },

  /** Short self-introduction on the home page — one paragraph per line. */
  bio: [
    "哈囉，我是 Your Name，一個喜歡把東西做出來的軟體工程師。",
    "這個部落格是我記錄學習、分享作品，以及整理想法的地方。歡迎隨時與我聯繫！",
  ],

  /**
   * Show the "Writing Activity" heatmap (a year of posting history) at the
   * bottom of the home page. Off by default — it looks empty on a new blog.
   */
  showWritingActivity: false,

  /**
   * Show the LeetCode section: the /leetcode list page, its navbar link, the
   * home page card and the ⌘K entry. Posts with `type: leetcode` still work at
   * /leetcode/<id> either way. Use _templates/leetcode-post.md to write one.
   */
  showLeetCode: false,

  // ── Version ───────────────────────────────
  /** Injected from package.json by next.config.ts — bump the version there. */
  version: `v${process.env.NEXT_PUBLIC_APP_VERSION}`,

  // ── SEO ───────────────────────────────────
  keywords: ["Next.js", "React", "Programming", "Blog"],
  locale: "zh_TW",
  lang: "zh-TW",

  // ── Giscus Comments ───────────────────────
  // Get your own values at https://giscus.app
  // Leave as null to disable comments entirely.
  giscus: null as GiscusConfig | null,
  // Example:
  // giscus: {
  //   repo: "you/blog-comments",
  //   repoId: "R_xxxxxxxx",
  //   category: "Announcements",
  //   categoryId: "DIC_xxxxxxxx",
  //   lang: "zh-TW",
  // },
};

export interface GiscusConfig {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  lang: string;
}
