import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}

export const ConfirmModal = ({
  open,
  title = '확인',
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onClose,
  danger = false,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onClose} closeOnBackdrop={false}>
      <div className="flex flex-col items-center text-center p-4 text-gray-900 dark:text-gray-100">
        <div
          className={clsx(
            'mb-4 flex h-12 w-12 items-center justify-center rounded-full',
            danger
              ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300'
              : 'bg-blue-100 dark:bg-blue-500/20 text-primary-base dark:text-blue-300'
          )}
        >
          {danger ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="secondary"
            className="flex-1 py-3 text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-none rounded-lg"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            className={clsx(
              'flex-1 py-3 rounded-lg',
              danger && 'bg-red-600 text-white hover:bg-red-700 border-transparent'
            )}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
