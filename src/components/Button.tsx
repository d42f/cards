import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 ${variants[variant]} ${className}`}
    />
  );
}
