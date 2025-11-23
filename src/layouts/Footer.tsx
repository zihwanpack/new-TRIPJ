import { useLocation } from 'react-router-dom';
import { FOOTER_ITEMS } from '../constants/footerItems.ts';

export const Footer = () => {
  const { pathname } = useLocation();

  return (
    <footer className="mt-2">
      <nav className="grid grid-cols-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-center text-xs font-medium text-slate-500">
        {FOOTER_ITEMS.map(({ label, onEmoji, offEmoji, path }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1 text-slate-500 transition hover:text-slate-900 cursor-grab"
          >
            <img src={pathname === path ? onEmoji : offEmoji} className="text-base" />
            {label}
          </button>
        ))}
      </nav>
    </footer>
  );
};
