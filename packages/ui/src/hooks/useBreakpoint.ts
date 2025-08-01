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
import { useCallback, useState, useEffect } from 'react';
import type { Breakpoint } from '../types';

export const breakpoints: { name: string; id: Breakpoint; value: number }[] = [
  { name: 'Initial', id: 'initial', value: 0 },
  { name: 'Extra Small', id: 'xs', value: 640 },
  { name: 'Small', id: 'sm', value: 768 },
  { name: 'Medium', id: 'md', value: 1024 },
  { name: 'Large', id: 'lg', value: 1280 },
  { name: 'Extra Large', id: 'xl', value: 1536 },
];

// Simple media query hook that only creates one listener
function useSingleMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    } else {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      } else {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
}

// Hook to get current breakpoint efficiently - only triggers on breakpoint changes
function useCurrentBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'initial';

    const width = window.innerWidth;
    if (width >= 1536) return 'xl';
    if (width >= 1280) return 'lg';
    if (width >= 1024) return 'md';
    if (width >= 768) return 'sm';
    if (width >= 640) return 'xs';
    return 'initial';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      let newBreakpoint: Breakpoint;

      if (width >= 1536) newBreakpoint = 'xl';
      else if (width >= 1280) newBreakpoint = 'lg';
      else if (width >= 1024) newBreakpoint = 'md';
      else if (width >= 768) newBreakpoint = 'sm';
      else if (width >= 640) newBreakpoint = 'xs';
      else newBreakpoint = 'initial';

      setBreakpoint(prev => (prev !== newBreakpoint ? newBreakpoint : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/** @public */
export const useBreakpoint = () => {
  // Use efficient breakpoint detection that only triggers on actual breakpoint changes
  const currentBreakpoint = useCurrentBreakpoint();

  // Lazy up function - creates media query only when called
  const up = useCallback((key: Breakpoint): boolean => {
    const targetBreakpoint = breakpoints.find(bp => bp.id === key);
    if (!targetBreakpoint) return false;

    // For 'initial', always return true since we're always at or above 0px
    if (key === 'initial') return true;

    const query = `(min-width: ${targetBreakpoint.value}px)`;
    return useSingleMediaQuery(query);
  }, []);

  // Lazy down function - creates media query only when called
  const down = useCallback((key: Breakpoint): boolean => {
    const targetBreakpoint = breakpoints.find(bp => bp.id === key);
    if (!targetBreakpoint) return false;

    // For 'initial', always return false since we can't be below 0px
    if (key === 'initial') return false;

    const query = `(max-width: ${targetBreakpoint.value - 1}px)`;
    return useSingleMediaQuery(query);
  }, []);

  return {
    breakpoint: currentBreakpoint,
    up,
    down,
  };
};
