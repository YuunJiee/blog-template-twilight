import Link from 'next/link';
import { Github, Linkedin, Mail, Rss } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  const { github, linkedin, email } = siteConfig.author;
  const iconCls = 'text-muted-foreground transition-colors hover:text-link';

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          {github && (
            <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconCls}>
              <Github className="h-4 w-4" />
            </a>
          )}
          {linkedin && (
            <a href={`https://linkedin.com/${linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconCls}>
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} aria-label="Email" className={iconCls}>
              <Mail className="h-4 w-4" />
            </a>
          )}
          <Link href="/feed.xml" aria-label="RSS" className={iconCls}>
            <Rss className="h-4 w-4" />
          </Link>
        </div>
        <p>
          © {new Date().getFullYear()} {siteConfig.author.name} ·{' '}
          <Link href="/changelog" className="font-mono text-xs hover:text-link">
            {siteConfig.version}
          </Link>
        </p>
      </div>
    </footer>
  );
}
