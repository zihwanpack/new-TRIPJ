import { createContext, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage.tsx';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-storage-key',
  ...props
}: ThemeProviderProps) {
  const { value: theme, setValue: setTheme } = useStorage<Theme>({
    key: storageKey,
    initialValue: defaultTheme,
    type: 'local',
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
export { ThemeContext, ThemeProvider };
