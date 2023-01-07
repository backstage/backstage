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
  StylesProvider as Mui4StylesProvider,
  ThemeProvider as Mui4Provider,
} from '@material-ui/core/styles';
import type { Theme as Mui4Theme } from '@material-ui/core/styles';
import {
  StyledEngineProvider,
  Theme as Mui5Theme,
  ThemeProvider as Mui5Provider,
} from '@mui/material/styles';
import {
  StylesProvider as Mui5StylesProvider,
  createGenerateClassName,
} from '@mui/styles';
import Mui4CssBaseline from '@material-ui/core/CssBaseline';
import Mui5CssBaseline from '@mui/material/CssBaseline';
import { UnifiedTheme } from './types';

const generateV4ClassName = createGenerateClassName({
  seed: 'm4',
});
const generateV5ClassName = createGenerateClassName({
  seed: 'm5',
});

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
  const { children, theme, noCssBaseline = false } = props;

  const v4Theme = theme.getTheme('v4');
  const v5Theme = theme.getTheme('v5');

  let cssBaseline: JSX.Element | undefined = undefined;
  if (!noCssBaseline) {
    if (v5Theme) {
      cssBaseline = <Mui5CssBaseline enableColorScheme />;
    } else if (v4Theme) {
      cssBaseline = <Mui4CssBaseline />;
    }
  }

  let result = (
    <>
      {cssBaseline}
      {children}
    </>
  );

  if (v4Theme) {
    result = (
      <Mui4StylesProvider generateClassName={generateV4ClassName} injectFirst>
        <Mui4Provider theme={v4Theme as Mui4Theme}>{result}</Mui4Provider>
      </Mui4StylesProvider>
    );
  }

  if (v5Theme) {
    result = (
      <Mui5StylesProvider generateClassName={generateV5ClassName}>
        <StyledEngineProvider injectFirst>
          <Mui5Provider theme={v5Theme as Mui5Theme}>{result}</Mui5Provider>
        </StyledEngineProvider>
      </Mui5StylesProvider>
    );
  }

  return result;
}
