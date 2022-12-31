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
  createTheme as createV4Theme,
  ThemeOptions as ThemeOptionsV4,
} from '@material-ui/core/styles';
import { PaletteOptions as PaletteOptionsV4 } from '@material-ui/core/styles/createPalette';
import { PaletteOptions as PaletteOptionsV5 } from '@mui/material/styles/createPalette';
import {
  adaptV4Theme,
  Theme as Mui5Theme,
  createTheme as createV5Theme,
  ThemeOptions as ThemeOptionsV5,
} from '@mui/material/styles';
import { transformV5ComponentThemesToV4 } from './overrides';
import { PageTheme } from '../types';
import { defaultComponentThemes } from '../v5';
import { createBaseThemeOptions } from './createBaseThemeOptions';
import { UnifiedTheme } from './types';

export class UnifiedThemeHolder implements UnifiedTheme {
  #themes = new Map<string, unknown>();

  constructor(v4?: Mui4Theme, v5?: Mui5Theme) {
    this.#themes = new Map();
    if (v4) {
      this.#themes.set('v4', v4);
    }
    if (v5) {
      this.#themes.set('v5', v5);
    }
  }

  getTheme(version: string): unknown | undefined {
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
}

/**
 * Creates a new {@link UnifiedTheme} using the provided options.
 *
 * @public
 */
export function createUnifiedTheme(
  options: UnifiedThemeOptions,
): UnifiedThemeHolder {
  const themeOptions = createBaseThemeOptions(options);
  const components = { ...defaultComponentThemes, ...options.components };
  const v5Theme = createV5Theme({ ...themeOptions, components });
  const v4Overrides = transformV5ComponentThemesToV4(v5Theme, components);
  const v4Theme = { ...createV4Theme(themeOptions), ...v4Overrides };

  return new UnifiedThemeHolder(v4Theme, v5Theme);
}

/**
 * Creates a new {@link UnifiedTheme} using MUI v4 theme options.
 * Note that this uses `adaptV4Theme` from MUI v5, which is deprecated.
 *
 * @public
 */
export function createUnifiedThemeFromV4(options: ThemeOptionsV4) {
  const v4Theme = createV4Theme(options);
  const v5Theme = adaptV4Theme(options as any);

  return new UnifiedThemeHolder(v4Theme, v5Theme);
}
