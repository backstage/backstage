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
import {
  UnifiedThemeProvider,
  themes as builtinThemes,
} from '@backstage/theme';
import DarkIcon from '@material-ui/icons/Brightness2';
import LightIcon from '@material-ui/icons/WbSunny';
import { AppTheme } from '@backstage/core-plugin-api';

export const themes: AppTheme[] = [
  {
    id: 'light',
    title: 'Light Theme',
    variant: 'light',
    icon: <LightIcon />,
    Provider: ({ children }) => (
      <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
    ),
  },
  {
    id: 'dark',
    title: 'Dark Theme',
    variant: 'dark',
    icon: <DarkIcon />,
    Provider: ({ children }) => (
      <UnifiedThemeProvider theme={builtinThemes.dark} children={children} />
    ),
  },
];
