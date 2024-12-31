import React, { createContext, useContext, ReactNode, useState } from 'react';
import { components } from './data';

// Create a context with an empty array as the default value
const PlaygroundContext = createContext<{
  selectedScreenSizes: string[];
  setSelectedScreenSizes: (screenSizes: string[]) => void;
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
}>({
  selectedScreenSizes: [],
  setSelectedScreenSizes: () => {},
  selectedComponents: [],
  setSelectedComponents: () => {},
});

// Create a provider component
export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
  const [selectedScreenSizes, setSelectedScreenSizes] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    components.map(component => component.slug),
  );

  return (
    <PlaygroundContext.Provider
      value={{
        selectedScreenSizes,
        setSelectedScreenSizes,
        selectedComponents,
        setSelectedComponents,
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
