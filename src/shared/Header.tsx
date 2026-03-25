import Link from 'next/link';
import { Metadata } from 'next';
import { auth, signOut } from '@/auth';
import { Button } from '@/shared/Button';

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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto h-14 flex items-center px-6 gap-4">
        {title && (
          <Link href="/" className="font-semibold mr-auto">
            {title as string}
          </Link>
        )}

        <Link href="/settings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition">
          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700 text-xs uppercase">
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
