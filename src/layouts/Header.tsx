import { X } from 'lucide-react';

export const Header = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center bg-white pb-4 pt-2">
      <X className="size-6 cursor-pointer" />
      {title}
    </header>
  );
};
