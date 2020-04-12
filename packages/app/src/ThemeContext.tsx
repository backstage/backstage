/*
 * Copyright 2020 Spotify AB
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

import React, { useState, useEffect } from 'react';
export type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};
export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function useThemeType(themeId: string): [string, () => void] {
  const [theme, setTheme] = useState(themeId);
  useEffect(() => {
    if (!window.matchMedia) {
      return () => {};
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const darkListener = (event: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === 'auto') {
        if (event.matches) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
        setTheme('auto');
      }
    };
    mql.addListener(darkListener);
    return () => {
      mql.removeListener(darkListener);
    };
  });
  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      if (!window.matchMedia) {
        setTheme('light');
        localStorage.setItem('theme', 'light');
        setTheme('light');
        return;
      }
      setTheme('auto');
      localStorage.setItem('theme', 'auto');
      setTheme('auto');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }
  return [theme, toggleTheme];
}
