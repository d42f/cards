'use client';

import NextLink from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Content, Item, Portal, Root, Trigger } from '@radix-ui/react-dropdown-menu';

interface Props {
  user?: Session['user'];
}

export function UserMenu({ user }: Props) {
  const name = user?.name ?? user?.email ?? 'User';
  const role = user?.role;
  return (
    <Root>
      <Trigger className="bg-sage flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-medium text-white uppercase focus:outline-none">
        {name.slice(0, 2)}
      </Trigger>

      <Portal>
        <Content
          align="end"
          sideOffset={8}
          className="border-neutral-deep bg-neutral-light z-50 w-44 rounded-xl border py-2 text-sm shadow-lg"
        >
          <div className="border-neutral-deep border-b px-4 py-2">
            <p className="text-neutral truncate text-sm font-medium">{name}</p>
            {role && (
              <p className="text-neutral-black text-xs capitalize">{role === 'TEACHER' ? 'Teacher' : 'Student'}</p>
            )}
          </div>

          <Item asChild>
            <NextLink href="/profile" className="data-[highlighted]:bg-neutral-mid block px-4 py-2 outline-none">
              Profile
            </NextLink>
          </Item>

          <Item
            onSelect={() => signOut({ callbackUrl: '/login' })}
            className="text-neutral data-[highlighted]:bg-neutral-mid cursor-pointer px-4 py-2 outline-none"
          >
            Sign out
          </Item>
        </Content>
      </Portal>
    </Root>
  );
}
