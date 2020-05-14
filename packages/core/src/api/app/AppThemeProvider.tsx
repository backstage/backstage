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

import React, { FC } from 'react';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { useApi, appThemeApiRef, AppTheme } from '../apis';
import { useObservable } from 'react-use';

// This tries to find the most accurate match, but also falls back to less
// accurate results in order to avoid errors.
function resolveTheme(themeId: string | undefined, themes: AppTheme[]) {
  if (themeId !== undefined) {
    const selectedTheme = themes.find((theme) => theme.id === themeId);
    if (selectedTheme) {
      return selectedTheme;
    }
  }

  const preferDark = window?.matchMedia('(prefers-color-scheme: dark)')
    ?.matches;

  if (preferDark) {
    const darkTheme = themes.find((theme) => theme.variant === 'dark');
    if (darkTheme) {
      return darkTheme;
    }
  }

  const lightTheme = themes.find((theme) => theme.variant === 'light');
  if (lightTheme) {
    return lightTheme;
  }

  return themes[0];
}

export const AppThemeProvider: FC<{}> = ({ children }) => {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const theme = resolveTheme(themeId, appThemeApi.getInstalledThemes());
  if (!theme) {
    throw new Error('App has no themes');
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  );
};
