import { ReactNode } from 'react';
import { Close, Content, Overlay, Portal, Root, Title } from '@radix-ui/react-dialog';

import { cn } from '@/lib/cn';
import { CloseButton } from '@/shared/components/CloseButton';

export interface DialogProps {
  className?: string;
  open: boolean;
  variant?: 'modal' | 'fullscreen';
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Dialog({ className, open, variant = 'modal', title, children, onClose }: DialogProps) {
  const dialogTitle = (
    <>
      <Title className="text-2xl font-bold">{title}</Title>
      <Close asChild>
        <CloseButton onClick={onClose} />
      </Close>
    </>
  );

  const fullscreenContent = (
    <Content className={cn('fixed inset-0 z-50 flex flex-col bg-white', className)}>
      <div className="flex items-center justify-between border-b px-6 py-4">{dialogTitle}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </Content>
  );

  const content = (
    <>
      <Overlay className="fixed inset-0 z-50 bg-black/30" />
      <div className="fixed inset-0 z-50 flex max-h-screen items-start justify-center overflow-y-auto px-4 py-20">
        <Content className={cn('w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow', className)}>
          <div className="flex items-center justify-between">{dialogTitle}</div>
          {children}
        </Content>
      </div>
    </>
  );

  return (
    <Root open={open} onOpenChange={o => !o && onClose()}>
      <Portal>{variant === 'fullscreen' ? fullscreenContent : content}</Portal>
    </Root>
  );
}
