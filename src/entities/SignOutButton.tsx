'use client';

import { signOut } from 'next-auth/react';

import { Button, ButtonProps } from '@/shared/components/Button';

export function SignOutButton(props: Omit<ButtonProps, 'onClick'>) {
  return <Button {...props} onClick={() => signOut({ callbackUrl: '/login' })} />;
}
