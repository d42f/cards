import { cn } from '@/lib/cn';
import { Button, ButtonProps } from '@/shared/components/Button';

export function CloseButton({ className, variant = 'ghost', size = 'sm', ...props }: ButtonProps) {
  return (
    <Button
      className={cn('p-2 text-lg leading-none', className)}
      variant={variant}
      size={size}
      aria-label="Close"
      {...props}
    >
      ✕
    </Button>
  );
}
