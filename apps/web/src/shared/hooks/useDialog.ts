import { useCallback, useState } from 'react';

import { Dialog, DialogProps } from '@/shared/components/Dialog';

type RenderOptions = Omit<DialogProps, 'open' | 'onClose'>;

export function useDialog() {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  const render = (props: RenderOptions) => Dialog({ ...props, open, onClose: hide });

  return { show, hide, render };
}
