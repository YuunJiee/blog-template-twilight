'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TocNav({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (first) setActiveId(first.target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav aria-label="文章目錄" className="flex flex-col border-l border-border text-sm">
      {toc.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              '-ml-px border-l-2 py-1 leading-snug transition-colors',
              item.level <= 2 ? 'pl-3' : 'pl-6 text-[0.8rem]',
              isActive
                ? 'border-accent font-medium text-link'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {item.text}
          </a>
        );
      })}
    </nav>
  );
}
