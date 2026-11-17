/**
 * ─────────────────────────────────────────────
 *  About page content — replace with your own.
 * ─────────────────────────────────────────────
 */

/** Rendered as an alternating timeline under 「我的旅程」, newest first. */
export const timelineData = [
  {
    date: "2025.09 ~",
    title: "某某公司 軟體工程師",
    description: "負責前端與部署流程。把這段換成你自己的經歷。",
  },
  {
    date: "2023.09 ~ 2025.06",
    title: "某某大學 資訊工程研究所",
    description: "研究主題、實驗室或代表作品。",
  },
  {
    date: "2019.09 ~ 2023.06",
    title: "某某大學 資訊工程學系",
    description: "大學時期的重點經歷。",
  },
];

export type SkillLevel = "proficient" | "familiar" | "learning";

/** Rendered as pills under 「技術棧」; the colour shows the level. */
export const techStack: Record<string, { name: string; level: SkillLevel }[]> = {
  Languages: [
    { name: "TypeScript", level: "proficient" },
    { name: "Python",     level: "familiar"   },
    { name: "Go",         level: "learning"   },
  ],
  "Web & Backend": [
    { name: "Next.js",  level: "proficient" },
    { name: "React",    level: "proficient" },
    { name: "FastAPI",  level: "familiar"   },
  ],
  "Tools & Others": [
    { name: "Git",            level: "proficient" },
    { name: "Docker",         level: "familiar"   },
    { name: "GitHub Actions", level: "learning"   },
  ],
};

/** Set to [] to hide the section. */
export const honors = [
  "1st Place — Example Hackathon (2025)",
  "Best Paper — Example Conference (2024)",
];
