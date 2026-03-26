import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface CardProps {
  className?: string;
  title: string;
  children: ReactNode;
}

export function Card({ className, title, children }: CardProps) {
  return (
    <div className={cn('space-y-4 rounded-xl bg-white p-8 shadow', className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
