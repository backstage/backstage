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

import { ReactNode } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  ThemeProvider,
  StylesProvider,
  createGenerateClassName,
  Theme as Mui4Theme,
} from '@material-ui/core/styles';
import {
  StyledEngineProvider,
  ThemeProvider as Mui5Provider,
  Theme as Mui5Theme,
} from '@mui/material/styles';
import { UnifiedTheme } from './types';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

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
 * This API is introduced in @mui/material (v5.0.5) as a replacement of deprecated createGenerateClassName & only affects v5 Material UI components from `@mui/*`.
 *
 * This call needs to be in the same module as the `UnifiedThemeProvider` to ensure that it doesn't get removed by tree shaking
 */
ClassNameGenerator.configure(componentName => {
  return `v5-${componentName}`;
});

// Background at https://mui.com/x/migration/migration-data-grid-v4/#using-mui-core-v4-with-v5
// Rather than disabling globals and custom seed, we instead only set a production prefix that
// won't collide with Material UI 5 styles. We've already got the separate class name generator
// for v5 set up in just above, so only the production JSS needs deduplication.
const generateV4ClassName = createGenerateClassName({
  productionPrefix: 'jss4-',
});

/**
 * Provides themes for all Material UI versions supported by the provided unified theme.
 *
 * @public
 */
export function UnifiedThemeProvider(
  props: UnifiedThemeProviderProps,
): JSX.Element {
  const { children, theme, noCssBaseline = false } = props;

  const v4Theme = theme.getTheme('v4') as Mui4Theme;
  const v5Theme = theme.getTheme('v5') as Mui5Theme;

  let cssBaseline: JSX.Element | undefined = undefined;
  if (!noCssBaseline) {
    cssBaseline = <CssBaseline />;
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
