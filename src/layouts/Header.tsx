import { X } from 'lucide-react';
import { Button } from '../components/Button.tsx';

type HeaderProps = {
  title: string;
  onClose?: () => void;
};

export const Header = ({ title, onClose }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white">
      <div className="w-6" />
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      {onClose && (
        <Button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          <X className="size-5" />
        </Button>
      )}
    </header>
  );
};
