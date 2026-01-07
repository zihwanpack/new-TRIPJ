interface ModalBackDropProps {
  closeOnBackdrop: boolean;
  onClose: () => void;
}

export const ModalBackDrop = ({ closeOnBackdrop, onClose }: ModalBackDropProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-slate-900/40"
      onClick={closeOnBackdrop ? onClose : undefined}
    />
  );
};
