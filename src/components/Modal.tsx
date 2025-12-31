import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
}

export const Modal = ({ open, onClose, children, closeOnBackdrop = true }: ModalProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div className="relative z-10 w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>,
    document.body
  );
};
