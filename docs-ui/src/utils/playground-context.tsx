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
  selectedTheme: Set<Theme>;
  setSelectedTheme: (keys: Set<Theme>) => void;
  selectedThemeName: ThemeName;
  setSelectedThemeName: (themeName: ThemeName) => void;
}>({
  selectedScreenSizes: [],
  setSelectedScreenSizes: () => { },
  selectedComponents: [],
  setSelectedComponents: () => { },
  selectedTheme: new Set(['light']),
  setSelectedTheme: () => { },
  selectedThemeName: 'backstage',
  setSelectedThemeName: () => { },
});

// Create a provider component
export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
  // Check if running in a browser environment
  const isBrowser = typeof window !== 'undefined';

  const [selectedScreenSizes, setSelectedScreenSizes] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    components.map(component => component.slug),
  );

  // Use lazy initialization to load from localStorage
  const [selectedTheme, setSelectedTheme] = useState<Set<Theme>>(() => {
    if (typeof window !== 'undefined') {
      const savedThemeString = localStorage.getItem('theme-mode');
      if (savedThemeString) {
        const themeArray = savedThemeString
          .split(',')
          .filter(Boolean) as Theme[];
        return new Set(themeArray);
      }
    }
    return new Set(['light']);
  });

  const [selectedThemeName, setSelectedThemeName] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const savedThemeName = localStorage.getItem('theme-name') as ThemeName;
      if (savedThemeName) {
        return savedThemeName;
      }
    }
    return 'backstage';
  });

  useEffect(() => {
    if (isBrowser) {
      document.documentElement.setAttribute(
        'data-theme-mode',
        Array.from(selectedTheme).join(','),
      );
      localStorage.setItem('theme-mode', Array.from(selectedTheme).join(','));
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
