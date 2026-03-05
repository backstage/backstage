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
  palettes,
  generatePaletteTokens,
  generateTypographyTokens,
} from '../base';
import { createUnifiedTheme } from './UnifiedTheme';

/**
 * Built-in Backstage Material UI themes.
 *
 * @public
 */
export const themes = {
  light: createUnifiedTheme({ palette: palettes.light }),
  dark: createUnifiedTheme({ palette: palettes.dark }),
};

/**
 * Generates a complete set of shadcn/ui CSS custom property token declarations
 * by combining palette-derived color tokens with typography tokens.
 *
 * This is the primary entry point for programmatic token generation. It merges
 * the output of {@link generatePaletteTokens} (color, border, status, sidebar
 * tokens) and {@link generateTypographyTokens} (font family, font size tokens)
 * into a single record suitable for injection as CSS custom properties.
 *
 * @example
 * ```ts
 * import { generateShadcnTokens, palettes } from '@backstage/theme';
 *
 * const lightTokens = generateShadcnTokens(palettes.light);
 * // Result: { '--background': '248 248 248', '--foreground': '0 0 0', '--font-sans': '...', ... }
 *
 * // Apply to document root:
 * Object.entries(lightTokens).forEach(([prop, value]) => {
 *   document.documentElement.style.setProperty(prop, value);
 * });
 * ```
 *
 * @param palette - A Backstage palette object (e.g., `palettes.light` or `palettes.dark`)
 * @param typography - Optional Backstage typography override. Falls back to default typography.
 * @returns A merged Record mapping CSS custom property names to their values,
 *          combining color tokens from the palette and typography tokens.
 *
 * @public
 */
export function generateShadcnTokens(
  palette: typeof palettes.light | typeof palettes.dark,
  typography?: Parameters<typeof generateTypographyTokens>[0],
): Record<string, string> {
  return {
    ...generatePaletteTokens(palette),
    ...generateTypographyTokens(typography),
  };
}
