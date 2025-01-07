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
import { icons } from '../components/Icon/icons';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { Breakpoint } from '../types';

/** @public */
export interface CanonContextProps {
  icons: IconMap;
  breakpoint: Breakpoint;
  getResponsiveValue: (
    value: string | Partial<Record<Breakpoint, string>>,
  ) => string;
}

const CanonContext = createContext<CanonContextProps>({
  icons,
  breakpoint: 'md',
  getResponsiveValue: () => '',
});

/** @public */
export interface CanonProviderProps {
  children?: ReactNode;
  overrides?: Partial<Record<IconNames, React.ComponentType>>;
}

/** @public */
export const CanonProvider = (props: CanonProviderProps) => {
  const { children, overrides } = props;

  // Merge provided overrides with default icons
  const combinedIcons = { ...icons, ...overrides };

  const isBreakpointSm = useMediaQuery(`(min-width: 640px)`);
  const isBreakpointMd = useMediaQuery(`(min-width: 768px)`);
  const isBreakpointLg = useMediaQuery(`(min-width: 1024px)`);
  const isBreakpointXl = useMediaQuery(`(min-width: 1280px)`);
  const isBreakpoint2xl = useMediaQuery(`(min-width: 1536px)`);

  // Determine the current breakpoint
  const breakpoint = (() => {
    if (isBreakpoint2xl) return '2xl';
    if (isBreakpointXl) return 'xl';
    if (isBreakpointLg) return 'lg';
    if (isBreakpointMd) return 'md';
    if (isBreakpointSm) return 'sm';
    return 'xs';
  })();

  const getResponsiveValue = (
    value: string | Partial<Record<Breakpoint, string>>,
  ) => {
    if (typeof value === 'object') {
      const breakpointsOrder: Breakpoint[] = [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ];
      const index = breakpointsOrder.indexOf(breakpoint);

      for (let i = index; i >= 0; i--) {
        if (value[breakpointsOrder[i]]) {
          return value[breakpointsOrder[i]] as string;
        }
      }
      return value['xs'] as string;
    }
    return value;
  };

  return (
    <CanonContext.Provider
      value={{ icons: combinedIcons, breakpoint, getResponsiveValue }}
    >
      {children}
    </CanonContext.Provider>
  );
};

/** @public */
export const useCanon = () => useContext(CanonContext);
