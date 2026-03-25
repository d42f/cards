import { Select, SelectProps } from '@/shared/ui/Select';

interface FormSelectProps extends SelectProps {
  label: string;
}

export function FormSelect({ label, className = '', ...props }: FormSelectProps) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${className}`}>
      {label}
      <Select {...props} />
    </label>
  );
}
