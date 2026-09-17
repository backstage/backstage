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

import {
  Theme as Mui4Theme,
  ThemeOptions as ThemeOptionsV4,
  createTheme,
} from '@material-ui/core/styles';
import type { PaletteOptions as PaletteOptionsV4 } from '@material-ui/core/styles/createPalette';
import {
  DeprecatedThemeOptions,
  Theme as Mui5Theme,
  PaletteOptions as PaletteOptionsV5,
  ThemeOptions as ThemeOptionsV5,
  adaptV4Theme,
  createTheme as createV5Theme,
} from '@mui/material/styles';
import { createBaseThemeOptions } from '../base/createBaseThemeOptions';
import { BackstageTypography, PageTheme } from '../base/types';
import { defaultComponentThemes } from '../v5';
import { transformV5ComponentThemesToV4 } from './overrides';
import { SupportedThemes, SupportedVersions, UnifiedTheme } from './types';

export class UnifiedThemeHolder implements UnifiedTheme {
  #themes = new Map<SupportedVersions, SupportedThemes>();

  constructor(v4?: Mui4Theme, v5?: Mui5Theme) {
    this.#themes = new Map();
    if (v4) {
      this.#themes.set('v4', v4);
    }
    if (v5) {
      this.#themes.set('v5', v5);
    }
  }

  getTheme(version: SupportedVersions): SupportedThemes | undefined {
    return this.#themes.get(version);
  }
}

/**
 * Options for creating a new {@link UnifiedTheme}.
 *
 * @public
 */
export interface UnifiedThemeOptions {
  palette: PaletteOptionsV4 & PaletteOptionsV5;
  defaultPageTheme?: string;
  pageTheme?: Record<string, PageTheme>;
  fontFamily?: string;
  htmlFontSize?: number;
  components?: ThemeOptionsV5['components'];
  typography?: BackstageTypography;
}

/**
 * Creates a new {@link UnifiedTheme} using the provided options.
 *
 * @public
 */
export function createUnifiedTheme(options: UnifiedThemeOptions): UnifiedTheme {
  const themeOptions = createBaseThemeOptions(options);
  const components = { ...defaultComponentThemes, ...options.components };
  const v5Theme = createV5Theme({ ...themeOptions, components });

  const v4Overrides = transformV5ComponentThemesToV4(v5Theme, components);
  const v4Theme = { ...createTheme(themeOptions), ...v4Overrides };
  return new UnifiedThemeHolder(v4Theme, v5Theme);
}

/**
 * Creates a new {@link UnifiedTheme} using Material UI v4 theme options.
 * Note that this uses `adaptV4Theme` from Material UI v5, which is deprecated.
 *
 * @public
 */
export function createUnifiedThemeFromV4(
  options: ThemeOptionsV4,
): UnifiedTheme {
  const v5Theme = adaptV4Theme(options as DeprecatedThemeOptions);
  const v4Theme = createTheme(options);
  return new UnifiedThemeHolder(v4Theme, createV5Theme(v5Theme));
}
