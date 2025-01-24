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

import type { Breakpoint } from '../types';
import { useBreakpoint, breakpoints } from './useBreakpoint';

type ResponsiveValue = string | Partial<Record<Breakpoint, string>>;

export const useResponsiveValue = (value: ResponsiveValue) => {
  const currentBreakpoint = useBreakpoint();

  if (typeof value === 'object') {
    const index = breakpoints.findIndex(
      breakpoint => breakpoint.id === currentBreakpoint,
    );

    for (let i = index; i >= 0; i--) {
      if (value[breakpoints[i].id]) {
        return value[breakpoints[i].id] as string;
      }
    }

    // If no value is found for the current or smaller breakpoints, check from the smallest
    for (let i = 0; i < breakpoints.length; i++) {
      if (value[breakpoints[i].id]) {
        return value[breakpoints[i].id] as string;
      }
    }
  }

  return value;
};
