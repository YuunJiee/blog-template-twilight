'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/theme-toggle';
import { OPEN_COMMAND_MENU_EVENT } from '@/components/command-menu';

const NAV_ITEMS = [
  { href: '/',          label: '首頁' },
  { href: '/blog',      label: '文章' },
  ...(siteConfig.showLeetCode ? [{ href: '/leetcode', label: 'LeetCode' }] : []),
  { href: '/projects',  label: '專案' },
  { href: '/about',     label: '關於' },
  { href: '/contact',   label: '聯絡' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  const openSearch = () => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav aria-label="主要導覽" className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-accent" />
          {siteConfig.name}
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-secondary font-medium text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="搜尋文章"
            className="inline-flex h-9 items-center gap-2 rounded-full px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-[18px] w-[18px]" />
            <kbd className="hidden rounded border border-border px-1.5 font-sans text-[0.7rem] lg:inline">⌘K</kbd>
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? '關閉選單' : '開啟選單'}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm',
                    active ? 'bg-secondary font-medium text-secondary-foreground' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
