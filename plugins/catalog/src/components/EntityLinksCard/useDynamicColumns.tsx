/*
 * Copyright 2020 The Backstage Authors
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

import { useState, useEffect } from 'react';
import { Breakpoint, ColumnBreakpoints } from './types';

const colDefaults: ColumnBreakpoints = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 3,
};

/** Backstage default breakpoint values (matching MUI v4 defaults) */
const breakpointValues: Record<Breakpoint, number> = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

/**
 * Returns true when window.matchMedia is available (browser environment).
 * Returns false in SSR or JSDOM test environments where matchMedia is not implemented.
 */
function hasMatchMedia(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  );
}

/**
 * SSR-safe hook that listens to a CSS media query using native window.matchMedia.
 * Replaces MUI's useMediaQuery to remove the @material-ui/core dependency.
 * Gracefully returns false in environments where matchMedia is unavailable (SSR, JSDOM).
 */
function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (!hasMatchMedia()) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!hasMatchMedia()) return undefined;
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useDynamicColumns(
  cols: ColumnBreakpoints | number | undefined,
): number {
  const matches: (Breakpoint | null)[] = [
    useMatchMedia(`(min-width: ${breakpointValues.xl}px)`) ? 'xl' : null,
    useMatchMedia(`(min-width: ${breakpointValues.lg}px)`) ? 'lg' : null,
    useMatchMedia(`(min-width: ${breakpointValues.md}px)`) ? 'md' : null,
    useMatchMedia(`(min-width: ${breakpointValues.sm}px)`) ? 'sm' : null,
    useMatchMedia(`(min-width: ${breakpointValues.xs}px)`) ? 'xs' : null,
  ];

  let numOfCols = 1;

  if (typeof cols === 'number') {
    numOfCols = cols;
  } else {
    const breakpoint = matches.find(k => k !== null) ?? 'xs';
    numOfCols = cols?.[breakpoint] ?? colDefaults[breakpoint];
  }

  return numOfCols;
}
