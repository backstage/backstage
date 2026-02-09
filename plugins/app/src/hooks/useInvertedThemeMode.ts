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

import { useState, useEffect, useMemo } from 'react';
import { useApi, appThemeApiRef } from '@backstage/core-plugin-api';
import useObservable from 'react-use/esm/useObservable';

type ThemeMode = 'light' | 'dark';

/**
 * Returns the inverted theme mode based on the active app theme.
 * Uses the AppThemeApi to detect the current theme variant reactively.
 * When the theme is set to "auto" (no explicit selection), falls back to
 * the system preference via `prefers-color-scheme`.
 *
 * @returns The inverted theme mode ('light' when app is dark, 'dark' when app is light)
 * @internal
 */
export function useInvertedThemeMode(): ThemeMode {
  const appThemeApi = useApi(appThemeApiRef);

  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  // Track system color scheme preference for "auto" mode
  const mediaQuery = useMemo(
    () => window.matchMedia('(prefers-color-scheme: dark)'),
    [],
  );
  const [prefersDark, setPrefersDark] = useState(mediaQuery.matches);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [mediaQuery]);

  // Resolve the active theme's variant, matching AppThemeProvider's logic:
  // 1. If a theme is explicitly selected, use its variant
  // 2. Otherwise (auto mode), use system preference to pick dark or light
  // 3. Fall back to the first installed theme
  const themes = appThemeApi.getInstalledThemes();
  let currentVariant: ThemeMode | undefined;

  if (themeId !== undefined) {
    currentVariant = themes.find(t => t.id === themeId)?.variant;
  }

  if (!currentVariant) {
    if (prefersDark) {
      currentVariant = themes.find(t => t.variant === 'dark')?.variant;
    }
    currentVariant ??= themes.find(t => t.variant === 'light')?.variant;
    currentVariant ??= themes[0]?.variant;
  }

  // Invert: if current is dark, toast should be light, and vice versa
  // Default to 'dark' if we can't determine (safe for most light-themed apps)
  if (currentVariant === 'dark') {
    return 'light';
  }
  return 'dark';
}
