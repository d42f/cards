import { ReactNode } from 'react';

import { Dialog as BaseDialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { cn } from '@/lib/cn';
import { CloseButton } from '@/shared/components/CloseButton';

export interface DialogProps {
  className?: string;
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  dismissible?: boolean;
}

export function Dialog({ className, open, title, children, onClose, dismissible = true }: DialogProps) {
  return (
    <BaseDialog open={open} onClose={dismissible ? onClose : () => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex max-h-screen items-start justify-center space-y-2 overflow-y-auto px-4 py-20">
        <DialogPanel className={cn('w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow', className)}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <CloseButton onClick={onClose} />
          </div>
          {children}
        </DialogPanel>
      </div>
    </BaseDialog>
  );
}
