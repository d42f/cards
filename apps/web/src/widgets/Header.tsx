import { Metadata } from 'next';

import { auth } from '@/auth';
import { SignOutButton } from '@/features/SignOutButton';
import { Link } from '@/shared/components/Link';
import { Logo } from '@/shared/components/Logo';

interface Props {
  title?: Metadata['title'];
}

export async function Header({ title }: Props) {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? 'User';

  return (
    <header className="border-neutral-deep border-b">
      <div className="px-6">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4">
          <Link href="/" variant="subtle" className="mr-auto flex items-center gap-2 font-semibold">
            <Logo className="h-8 rounded-lg p-2" />
            {title as string}
          </Link>

          {session?.user?.role && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize">
              {session.user.role === 'TEACHER' ? 'Teacher' : 'Student'}
            </span>
          )}

          <Link href="/profile" variant="subtle" className="flex items-center gap-2">
            <span className="bg-sage flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white uppercase">
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
