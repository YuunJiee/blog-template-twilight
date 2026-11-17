'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { CONTACT_MESSAGE_MAX_LENGTH } from '@/config/constants';
import { cn } from '@/lib/utils';

const FIELD_CLS =
  'w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors ' +
  'placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-ring/30';

export function ContactForm() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        toast.error(data.error ?? '傳送失敗，請稍後再試。');
        return;
      }
      setSent(true);
      toast.success('訊息已成功送出！');
    } catch {
      toast.error('網路錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <p className="mt-4 text-lg font-semibold">訊息已送出</p>
        <p className="mt-1 text-muted-foreground">感謝你的來信，我會盡快回覆。</p>
        <button
          type="button"
          onClick={() => { setSent(false); setEmail(''); setMessage(''); }}
          className="mt-6 text-sm text-link hover:underline"
        >
          再寫一封
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={FIELD_CLS}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">訊息</label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="想說什麼都可以，包括 bug 回報、功能建議或任何想法。"
          required
          minLength={10}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          rows={6}
          className={cn(FIELD_CLS, 'resize-y')}
        />
        <div className={cn('mt-1 text-right text-xs', message.length > 1800 ? 'text-destructive' : 'text-muted-foreground')}>
          {message.length}/{CONTACT_MESSAGE_MAX_LENGTH}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? '傳送中…' : '送出'}
      </button>
    </form>
  );
}
