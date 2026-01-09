import { X } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Typography } from '../components/common/Typography.tsx';

interface HeaderProps {
  title: string;
  onClose?: () => void;
}

export const Header = ({ title, onClose }: HeaderProps) => {
  return (
    <header className="relative flex items-center justify-center h-14 px-4 min-h-14 bg-white dark:bg-slate-900">
      <Typography variant="h2">{title}</Typography>
      {onClose && (
        <Button
          type="button"
          onClick={onClose}
          className="absolute right-4 p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer"
        >
          <X className="size-5" />
        </Button>
      )}
    </header>
  );
};
