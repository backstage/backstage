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

import { createContext, useContext, ReactNode, ComponentType } from 'react';
import { IconMap, IconNames } from '../components/Icon/types';
import { defaultIcons } from '../components/Icon/icons';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Breakpoints } from '../types';

const defaultBreakpoints: Breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

interface CanonContextProps {
  icons: IconMap;
  breakpoint: keyof Breakpoints;
  getResponsiveValue: (value: string | Partial<Breakpoints>) => string;
}

const CanonContext = createContext<CanonContextProps>({
  icons: defaultIcons,
  breakpoint: 'md',
  getResponsiveValue: () => '',
});

interface CanonProviderProps {
  children?: ReactNode;
  overrides?: Partial<Record<IconNames, ComponentType>>;
  breakpoints?: Partial<Breakpoints>;
}

/** @public */
export const CanonProvider = (props: CanonProviderProps) => {
  const { children, overrides, breakpoints = defaultBreakpoints } = props;

  // Merge provided overrides with default icons
  const combinedIcons = { ...defaultIcons, ...overrides };

  const isBreakpointSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isBreakpointMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isBreakpointLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isBreakpointXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const isBreakpoint2xl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

  // Determine the current breakpoint
  const breakpoint = (() => {
    if (isBreakpoint2xl) return '2xl';
    if (isBreakpointXl) return 'xl';
    if (isBreakpointLg) return 'lg';
    if (isBreakpointMd) return 'md';
    if (isBreakpointSm) return 'sm';
    return 'xs';
  })();

  const getResponsiveValue = (value: string | Partial<Breakpoints>) => {
    if (typeof value === 'object') {
      const breakpointsOrder: (keyof Breakpoints)[] = [
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
