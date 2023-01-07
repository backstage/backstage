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

import { Theme as Mui5Theme } from '@mui/material/styles';
import { createTheme as createMuiTheme } from '@material-ui/core/styles';
import type {
  GridProps,
  SwitchProps,
  Theme,
  ThemeOptions,
} from '@material-ui/core';
import { Overrides } from '@material-ui/core/styles/overrides';
import { SimpleThemeOptions } from './types';
import { createBaseThemeOptions } from '../base';
import { defaultComponentThemes } from '../v5';
import { transformV5ComponentThemesToV4 } from '../unified/overrides';

/**
 * An old helper for creating MUI v4 theme options.
 *
 * @public
 * @deprecated Use {@link createBaseThemeOptions} instead.
 */
export function createThemeOptions(options: SimpleThemeOptions): ThemeOptions {
  return {
    props: {
      MuiGrid: defaultComponentThemes?.MuiGrid
        ?.defaultProps as Partial<GridProps>,
      MuiSwitch: defaultComponentThemes?.MuiSwitch
        ?.defaultProps as Partial<SwitchProps>,
    },
    ...createBaseThemeOptions(options),
  };
}

/**
 * * An old helper for creating MUI v4 theme overrides.
 *
 * @public
 * @deprecated Use {@link defaultComponentThemes} with {@link transformV5ComponentThemesToV4} instead.
 */
export function createThemeOverrides(theme: Theme): Overrides {
  return transformV5ComponentThemesToV4(
    // Safe but we have to make sure we don't use mui5 specific stuff in the default component themes
    theme as unknown as Mui5Theme,
    defaultComponentThemes,
  ).overrides;
}

/**
 * The old method to create a Backstage MUI v4 theme using a palette.
 * The theme is created with the common Backstage options and component styles.
 *
 * @public
 * @deprecated Use {@link createUnifiedTheme} instead.
 */
export function createTheme(options: SimpleThemeOptions): Theme {
  const themeOptions = createThemeOptions(options);
  const baseTheme = createMuiTheme(themeOptions);
  const overrides = createThemeOverrides(baseTheme);
  const theme = { ...baseTheme, overrides };
  return theme;
}
