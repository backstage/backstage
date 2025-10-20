import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { components } from './data';

type Theme = 'light' | 'dark';
type ThemeName = 'backstage' | 'spotify' | 'custom';

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
  selectedThemeName: 'backstage',
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
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [selectedThemeName, setSelectedThemeName] =
    useState<ThemeName>('backstage');

  // Load saved theme from localStorage after hydration
  useEffect(() => {
    if (isBrowser) {
      const savedTheme = localStorage.getItem('theme-mode') as Theme;
      if (savedTheme) {
        setSelectedTheme(savedTheme);
      }
    }
  }, [isBrowser]);

  // Load saved theme name from localStorage after hydration
  useEffect(() => {
    if (isBrowser) {
      const savedThemeName = localStorage.getItem('theme-name') as ThemeName;
      if (savedThemeName) {
        setSelectedThemeName(savedThemeName);
      }
    }
  }, [isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      document.documentElement.setAttribute(
        'data-theme-mode',
        selectedTheme || 'light',
      );
      localStorage.setItem('theme-mode', selectedTheme || 'light');
    }
  }, [selectedTheme, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      document.documentElement.setAttribute(
        'data-theme-name',
        selectedThemeName || 'backstage',
      );
      localStorage.setItem('theme-name', selectedThemeName || 'backstage');
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
