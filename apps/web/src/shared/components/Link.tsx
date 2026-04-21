import { ComponentPropsWithoutRef, forwardRef } from 'react';
import NextLink from 'next/link';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const link = cva('focus-visible:ring-sage rounded-sm focus-visible:ring-2 focus-visible:outline-none', {
  variants: {
    variant: {
      inline: 'text-sage hover:underline',
      subtle: 'text-neutral hover:text-coal transition',
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
