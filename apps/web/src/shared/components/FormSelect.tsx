import { useId } from 'react';

import { cn } from '@/lib/cn';
import { Select, SelectProps } from '@/shared/components/Select';

export interface FormSelectProps extends SelectProps {
  inputClassName?: string;
  label: string;
  error?: string;
}

export function FormSelect({ className, inputClassName, id: idProp, label, error, ...props }: FormSelectProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Select id={id} className={cn('w-full', inputClassName)} {...props} />
      {error && <span className="text-xs font-normal text-red-500">{error}</span>}
    </div>
  );
}
