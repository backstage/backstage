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

import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

/**
 * Detects the current theme mode from the DOM and returns the inverted value.
 * Checks both document.documentElement and document.body for the data-theme-mode attribute.
 *
 * @returns The inverted theme mode ('light' when app is dark, 'dark' when app is light)
 * @internal
 */
export function useInvertedThemeMode(): ThemeMode {
  const [invertedThemeMode, setInvertedThemeMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const detectTheme = (): ThemeMode => {
      // Check both html and body elements for the theme attribute
      const htmlTheme =
        document.documentElement.getAttribute('data-theme-mode');
      const bodyTheme = document.body.getAttribute('data-theme-mode');

      // Prefer body (used by UnifiedThemeProvider) over html
      const currentTheme = bodyTheme || htmlTheme;

      // If current theme is dark, return light (inverted), otherwise return dark
      return currentTheme === 'dark' ? 'light' : 'dark';
    };

    // Initial detection
    setInvertedThemeMode(detectTheme());

    // Watch for theme changes on both html and body
    const observer = new MutationObserver(() => {
      setInvertedThemeMode(detectTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-mode'],
    });

    // Body might not exist in some edge cases (e.g., during SSR or early lifecycle)
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme-mode'],
      });
    }

    return () => observer.disconnect();
  }, []);

  return invertedThemeMode;
}
