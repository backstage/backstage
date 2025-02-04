import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { components } from './data';

type Theme = 'light' | 'dark';
type ThemeName = 'legacy' | 'default' | 'custom';

// Create a context with an empty array as the default value
const PlaygroundContext = createContext<{
  selectedScreenSizes: string[];
  setSelectedScreenSizes: (screenSizes: string[]) => void;
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;
  selectedThemeName: ThemeName;
  setSelectedThemeName: (themeName: ThemeName) => void;
}>({
  selectedScreenSizes: [],
  setSelectedScreenSizes: () => {},
  selectedComponents: [],
  setSelectedComponents: () => {},
  selectedTheme: 'light',
  setSelectedTheme: () => {},
  selectedThemeName: 'default',
  setSelectedThemeName: () => {},
});

// Create a provider component
export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
  // Check if running in a browser environment
  const isBrowser = typeof window !== 'undefined';

  const [selectedScreenSizes, setSelectedScreenSizes] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    components.map(component => component.slug),
  );
  const [selectedTheme, setSelectedTheme] = useState<Theme>(() => {
    return isBrowser
      ? (localStorage.getItem('theme') as Theme) || 'light'
      : 'light';
  });
  const [selectedThemeName, setSelectedThemeName] = useState<ThemeName>(() => {
    return isBrowser
      ? (localStorage.getItem('theme-name') as ThemeName) || 'default'
      : 'default';
  });

  useEffect(() => {
    if (isBrowser) {
      document.documentElement.setAttribute(
        'data-theme',
        selectedTheme || 'light',
      );
      localStorage.setItem('theme', selectedTheme || 'light');
    }
  }, [selectedTheme, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      document.documentElement.setAttribute(
        'data-theme-name',
        selectedThemeName || 'default',
      );
      localStorage.setItem('theme-name', selectedThemeName || 'default');
    }
  }, [selectedThemeName, isBrowser]);

  return (
    <PlaygroundContext.Provider
      value={{
        selectedScreenSizes,
        setSelectedScreenSizes,
        selectedComponents,
        setSelectedComponents,
        selectedTheme,
        setSelectedTheme,
        selectedThemeName,
        setSelectedThemeName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};

// Create a custom hook to use the screen sizes
export const usePlayground = () => {
  return useContext(PlaygroundContext);
};
