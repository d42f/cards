import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return <div className={cn('rounded-xl bg-white p-8 shadow', className)}>{children}</div>;
}
