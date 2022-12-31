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

import { Theme, ThemeOptions } from '@material-ui/core';
import {
  PaletteOptions,
  Palette,
} from '@material-ui/core/styles/createPalette';
import {
  BackstagePaletteAdditions,
  BackstageThemeAdditions,
  PageTheme,
  PageThemeSelector,
} from '../base/types';

/**
 * The full Backstage palette.
 *
 * @public
 * @deprecated This type is deprecated, the MUI Palette type is now always extended instead.
 */
export type BackstagePalette = Palette & BackstagePaletteAdditions;

/**
 * The full Backstage palette options.
 *
 * @public
 * @deprecated This type is deprecated, the MUI PaletteOptions type is now always extended instead.
 */
export type BackstagePaletteOptions = PaletteOptions &
  BackstagePaletteAdditions;

/**
 * Backstage theme options.
 *
 * @public
 * @deprecated This type is deprecated, the MUI ThemeOptions type is now always extended instead.
 * @remarks
 *
 * This is essentially a partial theme definition made by the user, that then
 * gets merged together with defaults and other values to form the final
 * {@link BackstageTheme}.
 *
 */
export interface BackstageThemeOptions extends ThemeOptions {
  palette: BackstagePaletteOptions;
  page: PageTheme;
  getPageTheme: (selector: PageThemeSelector) => PageTheme;
}

/**
 * A Backstage theme.
 *
 * @public
 * @deprecated This type is deprecated, the MUI Theme type is now always extended instead.
 */
export interface BackstageTheme extends Theme {
  palette: BackstagePalette;
  page: PageTheme;
  getPageTheme: (selector: PageThemeSelector) => PageTheme;
}

/**
 * A simpler configuration for creating a new theme that just tweaks some parts
 * of the backstage one.
 *
 * @public
 * @deprecated Use {@link BaseThemeOptionsInput} instead.
 */
export type SimpleThemeOptions = {
  palette: PaletteOptions;
  defaultPageTheme?: string;
  pageTheme?: Record<string, PageTheme>;
  fontFamily?: string;
  htmlFontSize?: number;
};

declare module '@material-ui/core/styles/createPalette' {
  interface Palette extends BackstagePaletteAdditions {}

  interface PaletteOptions extends BackstagePaletteAdditions {}
}

declare module '@material-ui/core/styles/createTheme' {
  interface Theme extends BackstageThemeAdditions {}

  interface ThemeOptions extends BackstageThemeAdditions {}
}
