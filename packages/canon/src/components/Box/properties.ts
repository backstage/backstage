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

/** @public */
export const breakpoints = {
  xs: {},
  sm: { '@media': 'screen and (min-width: 640px)' },
  md: { '@media': 'screen and (min-width: 768px)' },
  lg: { '@media': 'screen and (min-width: 1024px)' },
  xl: { '@media': 'screen and (min-width: 1280px)' },
  '2xl': { '@media': 'screen and (min-width: 1536px)' },
};

/** @public */
export const themes = {
  light: { selector: '[data-theme="light"] &' },
  dark: { selector: '[data-theme="dark"] &' },
};

/** @public */
export const space = {
  none: 0,
  xxs: 'var(--canon-space-xxs)',
  xs: 'var(--canon-space-xs)',
  sm: 'var(--canon-space-sm)',
  md: 'var(--canon-space-md)',
  lg: 'var(--canon-space-lg)',
  xl: 'var(--canon-space-xl)',
  xxl: 'var(--canon-space-xxl)',
};
