import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface CardProps {
  className?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ className, title, action, children }: CardProps) {
  return (
    <div className={cn('space-y-4 rounded-xl bg-white p-8 shadow', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
