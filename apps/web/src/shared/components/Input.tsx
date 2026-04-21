import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const input = cva(
  [
    'border-neutral-deep bg-neutral-bright text-neutral border',
    'placeholder:text-neutral-black',
    'focus-visible:inset-ring-sage focus-visible:inset-ring-2 focus-visible:outline-none',
    'invalid:border-red',
    'disabled:cursor-not-allowed disabled:opacity-35',
  ],
  {
    variants: {
      size: {
        sm: 'rounded-md p-2 text-sm/4.5 font-medium',
        md: 'rounded-lg p-3 text-base/4.5 font-medium',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & VariantProps<typeof input>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, size, ...props }, ref) {
  return <input ref={ref} className={cn(input({ size }), className)} {...props} />;
});
