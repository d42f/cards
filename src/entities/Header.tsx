import { Metadata } from 'next';

import { auth } from '@/auth';
import { SignOutButton } from '@/entities/SignOutButton';
import { Link } from '@/shared/components/Link';

interface Props {
  title?: Metadata['title'];
}

export async function Header({ title }: Props) {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? 'User';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
        {title && (
          <Link href="/" variant="subtle" className="mr-auto font-semibold">
            {title as string}
          </Link>
        )}

        <Link href="/profile" variant="subtle" className="flex items-center gap-2 text-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 uppercase">
            {name.slice(0, 2)}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        <SignOutButton />
      </div>
    </header>
  );
}
