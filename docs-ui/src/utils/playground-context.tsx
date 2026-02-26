import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useSyncExternalStore,
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
  setSelectedScreenSizes: () => {},
  selectedComponents: [],
  setSelectedComponents: () => {},
  selectedTheme: new Set(['light']),
  setSelectedTheme: () => {},
  selectedThemeName: 'backstage',
  setSelectedThemeName: () => {},
});

// Stable server snapshots (outside component to avoid recreating)
const defaultThemeSet = new Set<Theme>(['light']);
const defaultThemeName: ThemeName = 'backstage';

// Cache for theme Sets to avoid creating new objects on every getSnapshot call
let cachedThemeValue: string | null = null;
let cachedThemeSet: Set<Theme> = defaultThemeSet;

// Create a provider component
export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
  // Check if running in a browser environment
  const isBrowser = typeof window !== 'undefined';

  const [selectedScreenSizes, setSelectedScreenSizes] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    components.map(component => component.slug),
  );

  // Use useSyncExternalStore for SSR-safe localStorage access
  const selectedTheme = useSyncExternalStore(
    callback => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => {
      const saved = localStorage.getItem('theme-mode');

      // Return cached Set if value hasn't changed
      if (saved === cachedThemeValue) {
        return cachedThemeSet;
      }

      // Update cache with new value
      cachedThemeValue = saved;
      if (saved) {
        const themeArray = saved.split(',').filter(Boolean) as Theme[];
        cachedThemeSet = new Set(themeArray);
      } else {
        cachedThemeSet = defaultThemeSet;
      }

      return cachedThemeSet;
    },
    () => defaultThemeSet, // Stable server snapshot
  );

  const selectedThemeName = useSyncExternalStore(
    callback => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => {
      const saved = localStorage.getItem('theme-name') as ThemeName;
      return saved || defaultThemeName;
    },
    () => defaultThemeName, // Stable server snapshot
  );

  // Keep setter functions that update both state and localStorage
  const setSelectedTheme = (keys: Set<Theme>) => {
    const value = Array.from(keys).join(',');
    localStorage.setItem('theme-mode', value);
    // Invalidate cache
    cachedThemeValue = null;
    window.dispatchEvent(new Event('storage'));
  };

  const setSelectedThemeName = (name: ThemeName) => {
    localStorage.setItem('theme-name', name);
    window.dispatchEvent(new Event('storage'));
  };

  // Sync to DOM attributes when values change
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme-mode',
      Array.from(selectedTheme).join(','),
    );
  }, [selectedTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-name', selectedThemeName);
  }, [selectedThemeName]);

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
