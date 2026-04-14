import { useId } from 'react';

import { cn } from '@/lib/cn';
import { Input, InputProps } from '@/shared/components/Input';

export interface FormInputProps extends InputProps {
  inputClassName?: string;
  label: string;
  error?: string;
}

export function FormInput({ className, inputClassName, id: idProp, label, error, ...props }: FormInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Input id={id} className={cn('w-full', inputClassName)} {...props} />
      {error && <span className="text-xs font-normal text-red-500">{error}</span>}
    </div>
  );
}
