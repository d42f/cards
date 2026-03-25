import { ComponentProps } from 'react';
import NextLink from 'next/link';

import { cn } from '@/lib/cn';

type Variant = 'inline' | 'subtle';

const variants: Record<Variant, string> = {
  inline: cn('text-blue-600 hover:underline'),
  subtle: cn('text-gray-600 transition hover:text-gray-900'),
};

interface LinkProps extends ComponentProps<typeof NextLink> {
  variant?: Variant;
}

export function Link({ variant = 'inline', className, ...props }: LinkProps) {
  return <NextLink {...props} className={cn(variants[variant], className)} />;
}
