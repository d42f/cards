import { Metadata } from 'next';

import LogoIcon from '@/shared/icons/logo.svg';

import { auth } from '@/auth';
import { SignOutButton } from '@/features/SignOutButton';
import { Link } from '@/shared/components/Link';

interface Props {
  title?: Metadata['title'];
}

export async function Header({ title }: Props) {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? 'User';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4">
          <Link href="/" variant="subtle" className="mr-auto flex items-center gap-2 font-semibold">
            <LogoIcon className="h-6 w-6" />
            {title as string}
          </Link>

          {session?.user?.role && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize">
              {session.user.role === 'TEACHER' ? 'Teacher' : 'Student'}
            </span>
          )}

          <Link href="/profile" variant="subtle" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white uppercase">
              {name.slice(0, 2)}
            </span>
            <span className="hidden sm:inline">{name}</span>
          </Link>

          <SignOutButton variant="inline" size="inline">
            Sign out
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
