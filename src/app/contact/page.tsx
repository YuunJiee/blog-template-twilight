import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { PageHeader } from '@/components/page-header';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '聯絡',
  description: '有任何問題、Bug 回報或功能建議，歡迎來信！',
};

export default function ContactPage() {
  const { github } = siteConfig.author;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <PageHeader
        title="聯絡我"
        description="發現文章錯誤、頁面 Bug，或有任何建議與想法？填寫下方表單，我會盡快回覆。"
      />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <ContactForm />
      </div>
      {github && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          也可以到{' '}
          <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
            GitHub
          </a>{' '}
          找到我。
        </p>
      )}
    </div>
  );
}
