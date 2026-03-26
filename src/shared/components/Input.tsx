import { Input as BaseInput, InputProps as BaseInputProps } from '@headlessui/react';

import { cn } from '@/lib/cn';

export type InputProps = BaseInputProps;

export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      {...props}
      className={cn(
        'block w-full rounded-md border border-gray-300 px-3 py-2 text-base font-normal',
        'data-focus:ring-2 data-focus:ring-blue-500 data-focus:outline-none',
        className,
      )}
    />
  );
}
