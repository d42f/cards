import { ComponentPropsWithoutRef, forwardRef } from 'react';
import NextLink from 'next/link';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const link = cva('rounded-sm focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none', {
  variants: {
    variant: {
      inline: 'text-sky-600 hover:underline',
      subtle: 'text-gray-600 transition hover:text-gray-900',
    },
  },
  defaultVariants: {
    variant: 'inline',
  },
});

export interface LinkProps extends ComponentPropsWithoutRef<typeof NextLink>, VariantProps<typeof link> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ className, variant, ...props }, ref) {
  return <NextLink ref={ref} className={cn(link({ variant }), className)} {...props} />;
});
