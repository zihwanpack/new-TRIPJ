import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
      <div className="flex flex-col items-center text-center p-4">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            danger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-primary-base'
          }`}
        >
          {danger ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
        </div>

        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="secondary"
            className="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 border-none"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            className={`flex-1 py-3 ${
              danger ? 'bg-red-600 text-white hover:bg-red-700 border-transparent' : ''
            }`}
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
