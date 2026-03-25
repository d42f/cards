import Link from 'next/link';
import { Metadata } from 'next';
import { auth, signOut } from '@/auth';
import { Button } from '@/shared/ui/Button';

interface Props {
  title?: Metadata['title'];
}

export async function Header({ title }: Props) {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? 'User';

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
        {title && (
          <Link href="/" className="mr-auto font-semibold">
            {title as string}
          </Link>
        )}

        <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 uppercase">
            {name.slice(0, 2)}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        <form action={handleSignOut}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
