/*
 * Copyright 2020 The Backstage Authors
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

import React, { PropsWithChildren } from 'react';
import {
  ThemeProvider,
  createTheme as createMuiTheme,
} from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles';
import {
  costInsightsDarkTheme,
  costInsightsLightTheme,
} from '../../utils/styles';
import { CostInsightsTheme } from '../../types';

export const CostInsightsThemeProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  return (
    <ThemeProvider
      theme={(theme: Theme) =>
        createMuiTheme({
          ...theme,
          palette: {
            ...theme.palette,
            ...(theme.palette.type === 'dark'
              ? costInsightsDarkTheme.palette
              : costInsightsLightTheme.palette),
          },
        }) as CostInsightsTheme
      }
    >
      {children}
    </ThemeProvider>
  );
};
