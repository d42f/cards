import { cn } from '@/lib/cn';
import { Role } from '@/types/prisma';

const roles: { value: Role; label: string; description: string }[] = [
  { value: Role.STUDENT, label: 'Student', description: 'Learn from word sets' },
  { value: Role.TEACHER, label: 'Teacher', description: 'Create and share word sets' },
];

export interface RoleToggleProps {
  className?: string;
  value?: Role;
  onChange?: (value: Role) => void;
}

export function RoleToggle({ className, value = Role.STUDENT, onChange }: RoleToggleProps) {
  return (
    <div role="radiogroup" className={cn('bg-neutral-mid flex rounded-xl p-1', className)}>
      {roles.map(role => {
        const selected = value === role.value;
        return (
          <button
            className={cn(
              'flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg px-4 py-2 transition',
              'focus-visible:outline-sage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1',
              selected ? 'bg-neutral-bright shadow-sm' : 'hover:bg-neutral-light/60',
            )}
            key={role.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(role.value)}
          >
            <span className={cn('text-sm font-semibold', selected ? 'text-neutral' : 'text-neutral-black')}>
              {role.label}
            </span>
            <span className={cn('text-xs', selected ? 'text-neutral-coal' : 'text-neutral-black')}>
              {role.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
