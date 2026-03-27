import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface CardProps {
  className?: string;
  title?: string;
  children: ReactNode;
}

export function Card({ className, title, children }: CardProps) {
  return (
    <div className={cn('rounded-xl bg-white p-8 shadow', className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}
