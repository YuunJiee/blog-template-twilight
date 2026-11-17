import { getChangelogData } from '@/lib/changelog';
import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';

export const metadata = {
  title: '更新日誌',
  description: '記錄這個部落格的成長與演變。',
};

const TYPE_STYLE: Record<string, { label: string; cls: string }> = {
  feat:     { label: '新功能', cls: 'bg-primary/15 text-primary' },
  fix:      { label: '修正',   cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-300' },
  perf:     { label: '效能',   cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  refactor: { label: '重構',   cls: 'bg-secondary text-secondary-foreground' },
  style:    { label: '樣式',   cls: 'bg-accent/15 text-link' },
  docs:     { label: '文件',   cls: 'bg-muted text-muted-foreground' },
  chore:    { label: '雜項',   cls: 'bg-muted text-muted-foreground' },
};

export default function ChangelogPage() {
  const entries = getChangelogData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <PageHeader title="更新日誌" description="記錄這個部落格的成長與演變。" />

      <ol className="relative space-y-10 border-l border-border pl-8">
        {entries.map((entry) => (
          <li key={entry.version} className="relative">
            <span aria-hidden className="absolute top-1.5 -left-[39px] h-[15px] w-[15px] rounded-full border-2 border-primary bg-background" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs font-semibold text-secondary-foreground">
                {entry.version}
              </span>
              <time className="text-sm text-muted-foreground">{entry.date}</time>
            </div>
            <h2 className="mt-2 text-xl font-bold">{entry.title}</h2>
            {entry.description && <p className="mt-1 text-muted-foreground">{entry.description}</p>}
            {entry.changes && entry.changes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {entry.changes.map((change, j) => {
                  const t = TYPE_STYLE[change.type] ?? { label: change.type, cls: 'bg-muted text-muted-foreground' };
                  return (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <span className={cn('mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold', t.cls)}>
                        {t.label}
                      </span>
                      <span className="leading-relaxed">{change.content}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
