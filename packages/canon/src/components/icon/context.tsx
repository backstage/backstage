import React, { createContext, useContext, ReactNode } from 'react';
import { MoveUp, MoveDown } from 'lucide-react';
import { CustomIcon } from './custom-icon';

// List of icons available that can also be overridden.
export type IconNames = 'MoveDown' | 'MoveUp' | 'CustomIcon';

type IconMap = Partial<Record<IconNames, React.ComponentType>>;

interface IconContextProps {
  icons: IconMap;
}

// Create a default icon map with only the necessary icons
const defaultIcons: IconMap = {
  MoveUp,
  MoveDown,
  CustomIcon,
};

const IconContext = createContext<IconContextProps>({ icons: defaultIcons });

export const IconProvider = ({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides: IconMap;
}) => {
  // Merge provided overrides with default icons
  const combinedIcons = { ...defaultIcons, ...overrides };

  return (
    <IconContext.Provider value={{ icons: combinedIcons }}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => useContext(IconContext);
