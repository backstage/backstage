/*
 * Copyright 2025 The Backstage Authors
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
import { useMediaQuery } from './useMediaQuery';
import type { Breakpoint } from '../types';

export const breakpoints: { name: string; id: Breakpoint; value: number }[] = [
  { name: 'Initial', id: 'initial', value: 0 },
  { name: 'Extra Small', id: 'xs', value: 640 },
  { name: 'Small', id: 'sm', value: 768 },
  { name: 'Medium', id: 'md', value: 1024 },
  { name: 'Large', id: 'lg', value: 1280 },
  { name: 'Extra Large', id: 'xl', value: 1536 },
];

const getBreakpointValue = (key: Breakpoint): number => {
  const breakpoint = breakpoints.find(bp => bp.id === key);
  if (!breakpoint) {
    throw new Error(`Invalid breakpoint key: ${key}`);
  }
  return breakpoint.value;
};

/** @public */
export const useBreakpoint = () => {
  const matches = breakpoints.map(breakpoint => {
    const match = useMediaQuery(`(min-width: ${breakpoint.value}px)`);
    return match;
  });

  let breakpoint: Breakpoint = breakpoints[0].id;
  for (let i = matches.length - 1; i >= 0; i--) {
    if (matches[i]) {
      breakpoint = breakpoints[i].id;
      break;
    }
  }

  return {
    breakpoint,
    up: (key: Breakpoint): boolean => {
      const value = getBreakpointValue(key);
      return useMediaQuery(`(min-width: ${value}px)`);
    },
    down: (key: Breakpoint): boolean => {
      const value = getBreakpointValue(key);
      return useMediaQuery(`(max-width: ${value - 1}px)`);
    },
  };
};
