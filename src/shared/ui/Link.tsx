import NextLink from 'next/link';
import { ComponentProps } from 'react';

type Variant = 'inline' | 'subtle';

const variants: Record<Variant, string> = {
  inline: 'text-blue-600 hover:underline',
  subtle: 'text-gray-600 hover:text-gray-900 transition',
};

interface LinkProps extends ComponentProps<typeof NextLink> {
  variant?: Variant;
}

export function Link({ variant = 'inline', className = '', ...props }: LinkProps) {
  return <NextLink {...props} className={`${variants[variant]} ${className}`} />;
}
