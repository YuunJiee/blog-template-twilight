import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  className?: string;
}

/** Big page title + one-line description used on list pages. */
export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-10 fade-in-up', className)}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}

/** Small rounded tag pill. */
export function TagPill({ children, active, className }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
