import LogoIcon from '@/shared/icons/logo.svg';

import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return (
    <div className={cn('bg-sage aspect-square shrink-0 rounded-xl p-2.5', className)}>
      <LogoIcon className="size-full" />
    </div>
  );
}
