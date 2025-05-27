import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  subtitle?: string | ReactNode;
  className?: string;
}

export function PageTitle({ title, subtitle, className }: PageTitleProps) {
  return (
    <div className={cn("mb-10 text-center", className)}>
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80 sm:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
