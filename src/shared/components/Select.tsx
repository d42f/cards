import { SelectHTMLAttributes } from 'react';

import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const select = cva(
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

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, VariantProps<typeof select> {
  options: SelectOption[];
}

export function Select({ options, size, className, ...props }: SelectProps) {
  return (
    <select className={cn(select({ size }), className)} {...props}>
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
