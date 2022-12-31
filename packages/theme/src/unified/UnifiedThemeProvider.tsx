/*
 * Copyright 2022 The Backstage Authors
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

import React, { ReactNode } from 'react';
import {
  Theme as Mui4Theme,
  ThemeProvider as Mui4Provider,
} from '@material-ui/core/styles';
import {
  StyledEngineProvider,
  Theme as Mui5Theme,
  ThemeProvider as Mui5Provider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UnifiedTheme } from './types';

/**
 * Props for {@link UnifiedThemeProvider}.
 *
 * @public
 */
export interface UnifiedThemeProviderProps {
  children: ReactNode;
  theme: UnifiedTheme;
  noCssBaseline?: boolean;
}

/**
 * Provides themes for all MUI versions supported by the provided unified theme.
 *
 * @public
 */
export function UnifiedThemeProvider(
  props: UnifiedThemeProviderProps,
): JSX.Element {
  const { children, theme, noCssBaseline } = props;

  let result = noCssBaseline ? (
    <>{children}</>
  ) : (
    <>
      <CssBaseline />
      {children}
    </>
  );

  const v4Theme = theme.getTheme('v4');
  if (v4Theme) {
    result = <Mui4Provider theme={v4Theme as Mui4Theme}>{result}</Mui4Provider>;
  }

  const v5Theme = theme.getTheme('v5');
  if (v5Theme) {
    result = (
      <StyledEngineProvider injectFirst>
        <Mui5Provider theme={v5Theme as Mui5Theme}>{result}</Mui5Provider>
      </StyledEngineProvider>
    );
  }

  return result;
}
