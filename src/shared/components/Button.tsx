import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@headlessui/react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
  primary: cn(
    'border border-sky-600 bg-sky-600 text-white',
    'data-hover:border-sky-800 data-hover:bg-sky-700',
    'data-active:border-sky-800 data-active:bg-sky-700',
  ),
  secondary: cn(
    'border border-gray-100 bg-gray-100 text-gray-800',
    'data-hover:border-gray-300 data-hover:bg-gray-200',
    'data-active:border-gray-300 data-active:bg-gray-200',
  ),
  ghost: cn(
    'border border-transparent text-gray-500',
    'data-hover:border-gray-200 data-hover:bg-gray-100 data-hover:text-gray-900',
    'data-active:border-gray-200 data-active:bg-gray-100 data-active:text-gray-900',
  ),
};

export interface ButtonProps extends BaseButtonProps {
  variant?: Variant;
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <BaseButton
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
