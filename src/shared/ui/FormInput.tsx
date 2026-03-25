import { InputHTMLAttributes } from 'react';
import { Input } from '@/shared/ui/Input';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, className = '', ...props }: FormInputProps) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${className}`}>
      {label}
      <Input {...props} />
    </label>
  );
}
