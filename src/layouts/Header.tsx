import { X } from 'lucide-react';
import { Button } from '../components/Button.tsx';

type HeaderProps = {
  title: string;
  onClose?: () => void;
};

export const Header = ({ title, onClose }: HeaderProps) => {
  return (
    <header
      className={`flex items-center h-14 px-4 flex-shrink-0 bg-white ${onClose ? 'justify-between' : 'justify-center'}`}
    >
      <div className="w-1" />
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
