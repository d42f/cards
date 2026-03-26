import { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<Variant, string> = {
  primary: cn('border border-blue-600 bg-blue-600 text-white hover:border-blue-800 hover:bg-blue-700'),
  secondary: cn('border border-gray-100 bg-gray-100 text-gray-800 hover:border-gray-300 hover:bg-gray-200'),
  danger: cn('border border-red-500 bg-red-500 text-white hover:border-red-700 hover:bg-red-600'),
  ghost: cn('border border-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-100 hover:text-gray-900'),
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        'cursor-pointer rounded-md px-4 py-2 text-base font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
    />
  );
}
