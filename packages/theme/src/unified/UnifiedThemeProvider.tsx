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
import './MuiClassNameSetup';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  StyledEngineProvider,
  ThemeProvider as Mui5Provider,
} from '@mui/material/styles';
import CSSBaseline from '@mui/material/CssBaseline';
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
  const { children, theme, noCssBaseline = false } = props;

  const v4Theme = theme.getTheme('v4');
  const v5Theme = theme.getTheme('v5');

  let cssBaseline: JSX.Element | undefined = undefined;
  if (!noCssBaseline) {
    cssBaseline = <CSSBaseline />;
  }

  let result = (
    <>
      {cssBaseline}
      {children}
    </>
  );

  if (v4Theme) {
    result = <ThemeProvider theme={v4Theme}>{result}</ThemeProvider>;
  }

  if (v5Theme) {
    result = (
      <StyledEngineProvider injectFirst>
        <Mui5Provider theme={v5Theme}>{result}</Mui5Provider>
      </StyledEngineProvider>
    );
  }

  return result;
}
