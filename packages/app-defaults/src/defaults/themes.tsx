/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { darkTheme, lightTheme } from '@backstage/theme';
import DarkIcon from '@material-ui/icons/Brightness2';
import LightIcon from '@material-ui/icons/WbSunny';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppTheme } from '@backstage/core-plugin-api';

export const themes: AppTheme[] = [
  {
    id: 'light',
    title: 'Light Theme',
    variant: 'light',
    icon: <LightIcon />,
    theme: lightTheme,
    Provider: ({ children }) => (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    ),
  },
  {
    id: 'dark',
    title: 'Dark Theme',
    variant: 'dark',
    icon: <DarkIcon />,
    theme: darkTheme,
    Provider: ({ children }) => (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    ),
  },
];
