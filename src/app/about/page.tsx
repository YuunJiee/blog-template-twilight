import Image from 'next/image';
import { Github, Linkedin, Mail, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { techStack, timelineData, honors, type SkillLevel } from '@/data/about';

export const metadata = {
  title: '關於我',
  description: `認識 ${siteConfig.author.name}`,
};

const LEVEL: Record<SkillLevel, { label: string; pill: string; dot: string }> = {
  proficient: { label: '熟練',   pill: 'bg-primary text-primary-foreground',                 dot: 'bg-primary' },
  familiar:   { label: '熟悉',   pill: 'bg-secondary text-secondary-foreground',             dot: 'bg-secondary border border-border' },
  learning:   { label: '學習中', pill: 'border border-dashed border-accent text-link',        dot: 'border border-dashed border-accent' },
};

function Divider() {
  return <div className="mx-auto my-16 h-px w-16 bg-border" />;
}

export default function AboutPage() {
  const { name, affiliation, avatar, github, linkedin, email } = siteConfig.author;
  const links = [
    github   && { label: 'GitHub',   href: `https://github.com/${github}`,  icon: Github },
    linkedin && { label: 'LinkedIn', href: `https://linkedin.com/${linkedin}`, icon: Linkedin },
    email    && { label: 'Email',    href: `mailto:${email}`,               icon: Mail },
  ].filter((l): l is { label: string; href: string; icon: typeof Github } => Boolean(l));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      {/* ── Intro ── */}
      <section className="fade-in-up text-center">
        <Image
          src={avatar}
          alt={name}
          width={144}
          height={144}
          priority
          className="mx-auto h-36 w-36 rounded-full border-4 border-card bg-card object-cover shadow-lg"
        />
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">哈囉，我是 {name}</h1>
        {affiliation && <p className="mt-3 text-lg text-muted-foreground">{affiliation}</p>}
      </section>

      <Divider />

      {/* ── Journey: alternating timeline ── */}
      <section>
        <h2 className="mb-10 text-center text-2xl font-bold">我的旅程</h2>
        <ol className="relative">
          {/* center line on desktop, left line on mobile */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border md:left-1/2" />
          {timelineData.map((item, i) => {
            const right = i % 2 === 1;
            return (
              <li key={`${item.date}-${item.title}`} className="relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-2 md:gap-12 md:pl-0">
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2"
                />
                <div className={cn(right ? 'md:col-start-2' : 'md:text-right')}>
                  <time className="text-sm text-muted-foreground">{item.date}</time>
                  <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
                  {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <Divider />

      {/* ── Tech stack ── */}
      <section className="text-center">
        <h2 className="mb-8 text-2xl font-bold">技術棧</h2>
        <div className="space-y-6">
          {Object.entries(techStack).map(([category, skills]) => (
            <div key={category}>
              <h3 className="mb-3 font-semibold text-muted-foreground">{category}</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.map((skill) => (
                  <span key={skill.name} className={cn('rounded-full px-3.5 py-1 text-sm font-medium', LEVEL[skill.level].pill)}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-5 text-xs text-muted-foreground">
          {Object.values(LEVEL).map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className={cn('h-2.5 w-2.5 rounded-full', l.dot)} /> {l.label}
            </span>
          ))}
        </div>
      </section>

      {honors.length > 0 && (
        <>
          <Divider />
          <section>
            <h2 className="mb-8 text-center text-2xl font-bold">獲獎與榮譽</h2>
            <ul className="mx-auto max-w-xl space-y-3">
              {honors.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 fill-accent text-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {links.length > 0 && (
        <>
          <Divider />
          <section className="text-center">
            <h2 className="text-2xl font-bold">與我聯繫</h2>
            <p className="mt-3 text-muted-foreground">歡迎透過以下任何方式與我交流想法或討論合作機會。</p>
            <div className="mt-6 flex justify-center gap-3">
              {links.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:border-accent/60 hover:text-link"
                >
                  <Icon className="h-4 w-4" /> {label}
                </a>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
