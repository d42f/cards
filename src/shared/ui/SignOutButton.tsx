'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/shared/ui/Button';

export function SignOutButton() {
  return (
    <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/login' })}>
      Sign out
    </Button>
  );
}
