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
import { Breakpoints } from '../types';

export const getResponsiveValue = (
  value: any,
  breakpoint: keyof Breakpoints,
) => {
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
        return value[breakpointsOrder[i]];
      }
    }
    return value['xs'];
  }
  return value;
};
