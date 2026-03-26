import { cn } from '@/lib/cn';
import { Button, ButtonProps } from '@/shared/components/Button';

export function CloseButton({ className, variant = 'ghost', ...props }: ButtonProps) {
  return (
    <Button variant={variant} aria-label="Close" {...props} className={cn('p-2 text-lg/1 leading-none', className)}>
      ✕
    </Button>
  );
}
