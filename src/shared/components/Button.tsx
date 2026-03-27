import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const button = cva(
  [
    'cursor-pointer transition',
    'focus-visible:inset-ring-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border border-sky-600 bg-sky-600 text-white',
          'focus-visible:inset-ring-white',
          'hover:border-sky-800 hover:bg-sky-700',
          'active:border-sky-800 active:bg-sky-700',
        ],
        secondary: [
          'border border-gray-100 bg-gray-100 text-gray-800',
          'focus-visible:inset-ring-sky-500',
          'hover:border-gray-300 hover:bg-gray-200',
          'active:border-gray-300 active:bg-gray-200',
        ],
        ghost: [
          'border border-transparent text-gray-500',
          'focus-visible:inset-ring-sky-500',
          'hover:border-gray-200 hover:bg-gray-100 hover:text-gray-900',
          'active:border-gray-200 active:bg-gray-100 active:text-gray-900',
        ],
        inline: 'text-gray-500 hover:text-gray-900 focus-visible:inset-ring-sky-500 active:text-gray-900',
      },
      size: {
        sm: 'rounded-md px-3 py-2 text-sm font-medium',
        md: 'rounded-md px-3 py-2 text-base font-medium',
        lg: 'rounded-lg px-4 py-3 text-base font-semibold',
        inline: 'p-0 text-base font-medium',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = Omit<BaseButtonProps, 'size'> & VariantProps<typeof button>;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <BaseButton className={cn(button({ variant, size }), className)} type={type} {...props} />;
}
