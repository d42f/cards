import { Input as BaseInput, InputProps as BaseInputProps } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const input = cva(
  [
    'border border-gray-300 font-normal',
    'focus-visible:inset-ring-2 focus-visible:inset-ring-sky-500 focus-visible:outline-none',
    'invalid:border-red-400',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
  ],
  {
    variants: {
      size: {
        sm: 'rounded-md px-3 py-2 text-sm',
        md: 'rounded-md px-3 py-2 text-base',
        lg: 'rounded-lg px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type InputProps = Omit<BaseInputProps, 'size'> & VariantProps<typeof input>;

export function Input({ className, size, ...props }: InputProps) {
  return <BaseInput className={cn(input({ size }), className)} {...props} />;
}
