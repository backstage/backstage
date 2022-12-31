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

import { PageTheme, PageThemeSelector } from './types';
import { pageTheme as defaultPageThemes } from './pageTheme';

const DEFAULT_HTML_FONT_SIZE = 16;
const DEFAULT_FONT_FAMILY =
  '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif';
const DEFAULT_PAGE_THEME = 'home';

export interface BaseThemeOptionsInput<PaletteOptions> {
  palette: PaletteOptions;
  defaultPageTheme?: string;
  pageTheme?: Record<string, PageTheme>;
  fontFamily?: string;
  htmlFontSize?: number;
}

/**
 * A helper for creating theme options.
 *
 * @public
 */
export function createBaseThemeOptions<PaletteOptions>(
  options: BaseThemeOptionsInput<PaletteOptions>,
) {
  const {
    palette,
    htmlFontSize = DEFAULT_HTML_FONT_SIZE,
    fontFamily = DEFAULT_FONT_FAMILY,
    defaultPageTheme = DEFAULT_PAGE_THEME,
    pageTheme = defaultPageThemes,
  } = options;

  if (!pageTheme[defaultPageTheme]) {
    throw new Error(`${defaultPageTheme} is not defined in pageTheme.`);
  }

  return {
    palette,
    typography: {
      htmlFontSize,
      fontFamily,
      h1: {
        fontSize: 54,
        fontWeight: 700,
        marginBottom: 10,
      },
      h2: {
        fontSize: 40,
        fontWeight: 700,
        marginBottom: 8,
      },
      h3: {
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 6,
      },
      h4: {
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 6,
      },
      h5: {
        fontWeight: 700,
        fontSize: 24,
        marginBottom: 4,
      },
      h6: {
        fontWeight: 700,
        fontSize: 20,
        marginBottom: 2,
      },
    },
    page: pageTheme[defaultPageTheme],
    getPageTheme: ({ themeId }: PageThemeSelector) =>
      pageTheme[themeId] ?? pageTheme[defaultPageTheme],
  };
}
