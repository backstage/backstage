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
import { createTheme as createVanillaTheme } from '@vanilla-extract/css';
import { buttonTheme } from '../components/button/button.css';

const defaultTheme = {
  color: {
    accent: '#1ed760',
    background: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
  },
  space: {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  font: {
    regular: "'Inter', sans-serif",
    monospace: "'Monospace', monospace",
    emoji:
      "'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
  button: buttonTheme,
};

export const [themeClass, vars] = createVanillaTheme(defaultTheme);

// Use the inferred type from defaultVars
export function createTheme(themeOverrides: Partial<typeof vars> = {}) {
  const mergedTheme = {
    ...defaultTheme,
    ...themeOverrides,
    color: { ...defaultTheme.color, ...themeOverrides.color },
    space: { ...defaultTheme.space, ...themeOverrides.space },
    font: { ...defaultTheme.font, ...themeOverrides.font },
    button: { ...defaultTheme.button, ...themeOverrides.button },
  };

  return createVanillaTheme(mergedTheme);
}
