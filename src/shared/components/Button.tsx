import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<Variant, string> = {
  primary: cn('bg-blue-600 text-white hover:bg-blue-700'),
  secondary: cn('bg-gray-100 text-gray-800 hover:bg-gray-200'),
  danger: cn('bg-red-500 text-white hover:bg-red-600'),
  ghost: cn('text-gray-500 hover:bg-gray-100 hover:text-gray-900'),
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        'cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-900 transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
    />
  );
}
