import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { components } from './data';

// Create a context with an empty array as the default value
const PlaygroundContext = createContext<{
  selectedScreenSizes: string[];
  setSelectedScreenSizes: (screenSizes: string[]) => void;
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
  selectedTheme: string | null;
  setSelectedTheme: (theme: string) => void;
  selectedThemeName: string;
  setSelectedThemeName: (themeName: string) => void;
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
  const [selectedTheme, setSelectedTheme] = useState<string | null>(() => {
    return isBrowser ? localStorage.getItem('theme') : 'light';
  });
  const [selectedThemeName, setSelectedThemeName] = useState<string>(() => {
    return isBrowser
      ? localStorage.getItem('theme-name') || 'default'
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
