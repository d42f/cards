import { InputHTMLAttributes } from 'react';
import { Input } from '@/shared/ui/Input';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${className}`}>
      {label}
      <Input {...props} />
      {error && <span className="text-xs font-normal text-red-500">{error}</span>}
    </label>
  );
}
