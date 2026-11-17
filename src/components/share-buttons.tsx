'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const shareX = () => {
    const url = `https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const btn =
    'inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-accent/60 hover:text-link';

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">分享</span>
      <button type="button" onClick={copyLink} className={btn}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? '已複製' : '複製連結'}
      </button>
      <button type="button" onClick={shareX} className={btn}>
        <span className="font-bold leading-none">𝕏</span>
      </button>
    </div>
  );
}
