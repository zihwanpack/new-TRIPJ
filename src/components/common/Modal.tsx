import React from 'react';
import { createPortal } from 'react-dom';
import { ModalBackDrop } from './ModalBackDrop.tsx';
import { Typography } from './Typography.tsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  title?: string;
  description?: string;
}

export const Modal = ({
  open,
  children,
  title,
  description,
  closeOnBackdrop = true,
  onClose,
}: ModalProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ModalBackDrop closeOnBackdrop={closeOnBackdrop} onClose={onClose} />

      <div
        className="relative z-10 w-full max-w-[360px] min-h-[300px]
          flex flex-col gap-5 p-6 justify-between
          bg-white dark:bg-slate-800 
          rounded-3xl shadow-2xl 
          border border-gray-100 dark:border-slate-700 text-center"
      >
        <div className="flex flex-col gap-1.5 mt-2 h-full">
          {title && (
            <Typography
              variant="h2"
              color="secondary"
              className="text-xl font-bold text-gray-900 dark:text-white "
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="h3" color="muted" className="whitespace-pre-line mt-13">
              {description}
            </Typography>
          )}
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>,
    document.body
  );
};
