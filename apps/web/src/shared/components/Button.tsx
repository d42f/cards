import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const button = cva(
  [
    'cursor-pointer transition',
    'focus-visible:inset-ring-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-35',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-sage border border-transparent text-white',
          'focus-visible:inset-ring-white',
          'hover:opacity-85',
          'active:scale-97',
        ],
        outline: [
          'border-sage text-neutral border',
          'focus-visible:inset-ring-sage',
          'hover:bg-sage-bright',
          'active:bg-sage-light active:scale-97',
        ],
        ghost: [
          'bg-neutral-light text-neutral border border-transparent',
          'focus-visible:inset-ring-sage',
          'hover:bg-neutral-mid',
          'active:bg-neutral-deep active:scale-97',
        ],
        inline: 'text-gray-500 hover:text-gray-900 focus-visible:inset-ring-sky-500 active:text-gray-900',
      },
      size: {
        sm: 'rounded-full px-5 py-2 text-sm/4.5 font-medium',
        md: 'rounded-full px-6 py-3 text-base/4.5 font-medium',
        inline: 'text-base font-medium',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'size'> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} className={cn(button({ variant, size }), className)} type={type} {...props} />;
});
