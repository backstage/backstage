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

import { BackstageTypography, PageTheme, PageThemeSelector } from './types';
import { pageTheme as defaultPageThemes } from './pageTheme';

const DEFAULT_HTML_FONT_SIZE = 16;
const DEFAULT_FONT_FAMILY =
  '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif';
const DEFAULT_PAGE_THEME = 'home';

/**
 * Default Typography settings.
 *
 * @public
 */
export const defaultTypography: BackstageTypography = {
  htmlFontSize: DEFAULT_HTML_FONT_SIZE,
  fontFamily: DEFAULT_FONT_FAMILY,
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
};

/**
 * Options for {@link createBaseThemeOptions}.
 *
 * @public
 */
export interface BaseThemeOptionsInput<PaletteOptions> {
  palette: PaletteOptions;
  defaultPageTheme?: string;
  pageTheme?: Record<string, PageTheme>;
  fontFamily?: string;
  htmlFontSize?: number;
  typography?: BackstageTypography;
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
    typography,
  } = options;

  if (!pageTheme[defaultPageTheme]) {
    throw new Error(`${defaultPageTheme} is not defined in pageTheme.`);
  }

  defaultTypography.htmlFontSize = htmlFontSize;
  defaultTypography.fontFamily = fontFamily;

  return {
    palette,
    typography: typography ?? defaultTypography,
    page: pageTheme[defaultPageTheme],
    getPageTheme: ({ themeId }: PageThemeSelector) =>
      pageTheme[themeId] ?? pageTheme[defaultPageTheme],
  };
}

/**
 * Generates CSS custom property token declarations from Backstage typography settings.
 *
 * Converts Backstage typography configuration into shadcn/ui-compatible CSS custom
 * properties for font families, sizes, and weights. Supports a dual-font system:
 * proportional fonts for prose/navigation and monospace for identifiers/metadata.
 *
 * @public
 * @param typography - Optional Backstage typography override. Falls back to {@link defaultTypography}.
 * @returns A Record mapping CSS custom property names to their values
 */
export function generateTypographyTokens(
  typography?: BackstageTypography,
): Record<string, string> {
  const typo = typography ?? defaultTypography;

  return {
    // Font families — dual-font system per AAP Section 0.8.2
    '--font-sans': typo.fontFamily ?? DEFAULT_FONT_FAMILY,
    '--font-mono':
      "ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace",

    // Base font size
    '--html-font-size': `${typo.htmlFontSize ?? DEFAULT_HTML_FONT_SIZE}px`,

    // Heading font size scale
    '--font-size-h1':
      typeof typo.h1.fontSize === 'number'
        ? `${typo.h1.fontSize}px`
        : String(typo.h1.fontSize),
    '--font-size-h2':
      typeof typo.h2.fontSize === 'number'
        ? `${typo.h2.fontSize}px`
        : String(typo.h2.fontSize),
    '--font-size-h3':
      typeof typo.h3.fontSize === 'number'
        ? `${typo.h3.fontSize}px`
        : String(typo.h3.fontSize),
    '--font-size-h4':
      typeof typo.h4.fontSize === 'number'
        ? `${typo.h4.fontSize}px`
        : String(typo.h4.fontSize),
    '--font-size-h5':
      typeof typo.h5.fontSize === 'number'
        ? `${typo.h5.fontSize}px`
        : String(typo.h5.fontSize),
    '--font-size-h6':
      typeof typo.h6.fontSize === 'number'
        ? `${typo.h6.fontSize}px`
        : String(typo.h6.fontSize),

    // Font weights — aligned with BUI --bui-font-weight-regular (400) and --bui-font-weight-bold (600)
    '--font-weight-regular': '400',
    '--font-weight-bold': '600',
  };
}
