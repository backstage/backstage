/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { IconMap, IconNames } from '../components/Icon/types';
import { defaultIcons } from '../components/Icon/icons';

interface ThemeContextProps {
  icons: IconMap;
}

const ThemeContext = createContext<ThemeContextProps>({
  icons: defaultIcons,
});

/** @public */
export const ThemeProvider = ({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides: Partial<Record<IconNames, React.ComponentType>>;
}) => {
  // Merge provided overrides with default icons
  const combinedIcons = { ...defaultIcons, ...overrides };

  return (
    <ThemeContext.Provider value={{ icons: combinedIcons }}>
      {children}
    </ThemeContext.Provider>
  );
};

/** @public */
export const useTheme = () => useContext(ThemeContext);
