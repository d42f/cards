import { cn } from '@/lib/cn';
import { Select, SelectProps } from '@/shared/components/Select';

export interface FormSelectProps extends SelectProps {
  label: string;
  error?: string;
}

export function FormSelect({ label, error, className, ...props }: FormSelectProps) {
  return (
    <label className={cn('flex flex-col gap-1 text-sm font-medium', className)}>
      {label}
      <Select {...props} />
      {error && <span className="text-xs font-normal text-red-500">{error}</span>}
    </label>
  );
}
