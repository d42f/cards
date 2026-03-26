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
  variant?: 'modal' | 'fullscreen';
}

export function Dialog({
  className,
  open,
  title,
  children,
  onClose,
  dismissible = true,
  variant = 'modal',
}: DialogProps) {
  const dialogTitle = (
    <>
      <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
      <CloseButton onClick={onClose} />
    </>
  );

  const fullscreenDialogPanel = (
    <DialogPanel className={cn('fixed inset-0 flex flex-col bg-white', className)}>
      <div className="flex items-center justify-between border-b px-6 py-4">{dialogTitle}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </DialogPanel>
  );

  const modalDialogPanel = (
    <DialogPanel className={cn('w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow', className)}>
      <div className="flex items-center justify-between">{dialogTitle}</div>
      {children}
    </DialogPanel>
  );

  return (
    <BaseDialog open={open} onClose={dismissible ? onClose : () => {}} className="relative z-50">
      {variant === 'fullscreen' ? (
        fullscreenDialogPanel
      ) : (
        <>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex max-h-screen items-start justify-center space-y-2 overflow-y-auto px-4 py-20">
            {modalDialogPanel}
          </div>
        </>
      )}
    </BaseDialog>
  );
}
