import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Code2, FolderGit2, Github, Linkedin, Mail, Send, UserRound } from 'lucide-react';
import { getSortedPostsData, getHeatmapData, PostType } from '@/lib/posts';
import { PostHeatmap } from '@/components/post-heatmap';
import { TagPill } from '@/components/page-header';
import { siteConfig } from '@/config/site';

const FEATURE_CARDS = [
  { href: '/blog',     icon: BookOpen,   title: '文章與筆記', description: '技術文章、學習筆記與開發心得', action: '閱讀文章' },
  siteConfig.showLeetCode
    ? { href: '/leetcode', icon: Code2,     title: 'LeetCode', description: '刷題筆記與解題思路',     action: '查看題解' }
    : { href: '/about',    icon: UserRound, title: '關於我',   description: '經歷、技能與做過的事',   action: '認識我' },
  { href: '/projects', icon: FolderGit2, title: '專案',       description: '做過的作品與 side project',    action: '看看作品' },
  { href: '/contact',  icon: Send,       title: '聯絡',       description: '有問題或想法，歡迎來信',       action: '寫信給我' },
];

export default function HomePage() {
  const recent  = getSortedPostsData().slice(0, 5);
  const { github, linkedin, email } = siteConfig.author;

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-gradient px-4 pt-14 pb-28 text-center text-white md:pt-20 md:pb-44">
        <h1 className="fade-in-up text-3xl font-bold drop-shadow-sm md:text-5xl">
          Welcome to {siteConfig.name}
        </h1>
        <p
          className="fade-in-up mt-5 inline-block rounded-full bg-black/10 px-5 py-1.5 text-base text-white/90 backdrop-blur-sm md:text-lg"
          style={{ animationDelay: '0.15s' }}
        >
          {siteConfig.description}
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* ── Feature cards (overlap the hero) ── */}
        <section className="-mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 md:-mt-32 xl:grid-cols-4">
          {FEATURE_CARDS.map(({ href, icon: Icon, title, description, action }, i) => (
            <Link
              key={href}
              href={href}
              className="fade-in-up group flex flex-col rounded-2xl border-t-4 border-transparent bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              style={{ animationDelay: `${0.1 * i + 0.2}s` }}
            >
              <Icon className="h-7 w-7 text-link" />
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-1.5 flex-grow text-sm text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-link">
                {action}
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>

        {/* ── About me ── */}
        <section className="my-24 grid grid-cols-1 items-center gap-10 md:grid-cols-3">
          <div className="flex justify-center">
            <Image
              src={siteConfig.author.avatar}
              alt={siteConfig.author.name}
              width={160}
              height={160}
              priority
              className="h-40 w-40 rounded-full border-4 border-card bg-card object-cover shadow-lg"
            />
          </div>
          <div className="space-y-4 text-center md:col-span-2 md:text-left">
            <h2 className="text-3xl font-bold">About me</h2>
            {siteConfig.bio.map((line) => (
              <p key={line} className="text-lg leading-relaxed text-muted-foreground">{line}</p>
            ))}
            <div className="flex items-center justify-center gap-1 pt-1 md:justify-start">
              {github && (
                <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                   className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-link">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {linkedin && (
                <a href={`https://linkedin.com/${linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                   className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-link">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} aria-label="Email"
                   className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-link">
                  <Mail className="h-5 w-5" />
                </a>
              )}
              <Link href="/about" className="ml-2 text-sm font-medium text-link hover:underline">
                更多關於我 →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Latest posts ── */}
        <section className={siteConfig.showWritingActivity ? 'mb-24' : undefined}>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-3xl font-bold">最新文章</h2>
            <Link href="/blog" className="text-sm font-medium text-link hover:underline">全部文章 →</Link>
          </div>
          <div className="border-t border-border">
            {recent.map((post) => {
              const href = `/${post.type === PostType.LEETCODE ? 'leetcode' : 'blog'}/${post.id}`;
              return (
                <Link
                  key={post.id}
                  href={href}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-2 py-4 transition-colors hover:bg-muted sm:grid-cols-[1fr_auto_auto] sm:px-4"
                >
                  <h3 className="truncate font-semibold transition-colors group-hover:text-link">{post.title}</h3>
                  <div className="hidden items-center gap-1.5 sm:flex">
                    {post.tags.slice(0, 2).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-sm text-muted-foreground">{post.date}</p>
                      <p className="text-xs text-muted-foreground/70">{post.readingTime}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Writing activity (opt-in via siteConfig.showWritingActivity) ── */}
        {siteConfig.showWritingActivity && (
          <section>
            <h2 className="mb-6 text-3xl font-bold">Writing Activity</h2>
            <div className="rounded-2xl border border-border bg-card shadow-sm">
              <PostHeatmap {...getHeatmapData()} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
