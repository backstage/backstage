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

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { icons } from '../components/Icon/icons';
import { IconMap, IconNames } from '../components/Icon/types';

/** @public */
export interface CanonContextProps {
  icons: IconMap;
}

/** @public */
export interface CanonProviderProps {
  children?: ReactNode;
  overrides?: Partial<Record<IconNames, React.ComponentType>>;
}

const CanonContext = createContext<CanonContextProps>({
  icons,
});

/** @public */
export const CanonProvider = (props: CanonProviderProps) => {
  const { children, overrides } = props;

  // Merge provided overrides with default icons
  const combinedIcons = { ...icons, ...overrides };

  return (
    <CanonContext.Provider value={{ icons: combinedIcons }}>
      {children}
    </CanonContext.Provider>
  );
};

/** @public */
export const useCanon = () => useContext(CanonContext);
