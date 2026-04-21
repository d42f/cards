import { Metadata } from 'next';

import { auth } from '@/auth';
import { Link } from '@/shared/components/Link';
import { Logo } from '@/shared/components/Logo';
import { UserMenu } from '@/widgets/UserMenu';

interface Props {
  title?: Metadata['title'];
}

export async function Header({ title }: Props) {
  const session = await auth();

  return (
    <header className="border-neutral-deep border-b">
      <div className="px-6">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4">
          <Link href="/" variant="subtle" className="mr-auto flex items-center gap-2 font-serif text-lg">
            <Logo className="h-8 rounded-lg p-2" />
            {title as string}
          </Link>

          <UserMenu user={session?.user} />
        </div>
      </div>
    </header>
  );
}
