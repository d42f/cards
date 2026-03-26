import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-md border border-gray-300 px-3 py-2 text-base font-normal focus:ring-2 focus:ring-blue-500 focus:outline-none',
        className,
      )}
    />
  );
}
