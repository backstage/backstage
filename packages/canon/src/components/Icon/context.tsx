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
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Cloud } from 'lucide-react';
import { CustomIcon } from './custom-icon';

// List of icons available that can also be overridden.
/** @public */
export type IconNames =
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'Cloud'
  | 'CustomIcon';

type IconMap = Partial<Record<IconNames, React.ComponentType>>;

interface IconContextProps {
  icons: IconMap;
}

// Create a default icon map with only the necessary icons
const defaultIcons: IconMap = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Cloud,
  CustomIcon,
};

const IconContext = createContext<IconContextProps>({ icons: defaultIcons });

/** @public */
export const IconProvider = ({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides: Partial<Record<IconNames, React.ComponentType>>;
}) => {
  // Merge provided overrides with default icons
  const combinedIcons = { ...defaultIcons, ...overrides };

  return (
    <IconContext.Provider value={{ icons: combinedIcons }}>
      {children}
    </IconContext.Provider>
  );
};

/** @public */
export const useIcons = () => useContext(IconContext);
