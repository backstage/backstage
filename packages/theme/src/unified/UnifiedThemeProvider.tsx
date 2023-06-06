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
import {
  ThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
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

// Background at https://mui.com/x/migration/migration-data-grid-v4/#using-mui-core-v4-with-v5
// Rather than disabling globals and custom seed, we instead only set a production prefix that
// won't collide with MUI 5 styles. We've already got a separate class name generator for v5 set
// up in MuiClassNameSetup.ts, so only the production JSS needs deduplication.
const generateV4ClassName = createGenerateClassName({
  productionPrefix: 'jss4-',
});

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
    result = (
      <StylesProvider generateClassName={generateV4ClassName}>
        <ThemeProvider theme={v4Theme}>{result}</ThemeProvider>
      </StylesProvider>
    );
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
