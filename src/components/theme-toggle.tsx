'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Runs before first paint (inlined in <head>) so the page never flashes
 * the wrong theme. Uses the saved choice, else the OS preference.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`;

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
    setDark(next);
    window.dispatchEvent(new CustomEvent('themechange', { detail: next ? 'dark' : 'light' }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? '切換成淺色模式' : '切換成深色模式'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {/* Render both icons until mounted so the server HTML matches */}
      {dark === null ? <Sun className="h-[18px] w-[18px] opacity-0" /> : dark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </button>
  );
}
