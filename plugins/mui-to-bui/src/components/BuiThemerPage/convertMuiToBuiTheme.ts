/*
 * Copyright 2025 The Backstage Authors
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
import { BackstagePaletteAdditions } from '@backstage/theme';
import { blend, alpha } from '@mui/system/colorManipulator';

export interface ConvertMuiToBuiThemeResult {
  css: string;
  styleObject: Record<string, string>;
}

/**
 * Converts a MUI v5 Theme to BUI CSS variables
 * @param theme - The MUI v5 theme to convert
 * @returns Object containing CSS string and style object with BUI variables
 */
export function convertMuiToBuiTheme(
  theme: Mui5Theme,
): ConvertMuiToBuiThemeResult {
  const styleObject = generateBuiVariables(theme);

  const selector =
    theme.palette.mode === 'dark' ? "[data-theme-mode='dark']" : ':root';

  const css = `${selector} {\n${Object.entries(styleObject)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')}\n}`;

  return { css, styleObject };
}

/**
 * Generates BUI CSS variables from MUI theme
 */
function generateBuiVariables(theme: Mui5Theme): Record<string, string> {
  const styleObject: Record<string, string> = {};

  // Font families
  if (theme.typography.fontFamily) {
    styleObject['--bui-font-regular'] = theme.typography.fontFamily;
  }

  // Font weights
  if (theme.typography.fontWeightRegular) {
    styleObject['--bui-font-weight-regular'] = String(
      theme.typography.fontWeightRegular,
    );
  }
  if (theme.typography.fontWeightBold) {
    styleObject['--bui-font-weight-bold'] = String(
      theme.typography.fontWeightBold,
    );
  }

  const spacing = theme.spacing(1);
  // Skip spacing if the theme is using the default
  if (spacing !== '8px') {
    styleObject['--bui-space'] = `calc(${spacing} * 0.5)`;
  }

  // Border radius, only translate a 0 radius
  if (theme.shape.borderRadius === 0) {
    styleObject['--bui-radius-1'] = '0';
    styleObject['--bui-radius-2'] = '0';
    styleObject['--bui-radius-3'] = '0';
    styleObject['--bui-radius-4'] = '0';
    styleObject['--bui-radius-5'] = '0';
    styleObject['--bui-radius-6'] = '0';
  }

  // Colors - map MUI palette to BUI color tokens
  const palette = theme.palette as typeof theme.palette &
    Partial<BackstagePaletteAdditions>;

  // Base colors
  styleObject['--bui-black'] = palette.common.black;
  styleObject['--bui-white'] = palette.common.white;

  // Generate foreground colors
  Object.entries({
    primary: palette.text.primary,
    secondary: palette.textSubtle,
    disabled: palette.text.disabled,
    solid: palette.primary.contrastText,
    'solid-disabled': palette.text.disabled,
    danger: palette.error.main,
    warning: palette.warning.main,
    success: palette.success.main,
    info: palette.info?.main ?? palette.primary.main,
    'danger-on-bg': palette.error.dark,
    'warning-on-bg': palette.warning.dark,
    'success-on-bg': palette.success.dark,
    'info-on-bg': palette.info?.dark ?? palette.primary.dark,
  }).forEach(([key, value]) => {
    styleObject[`--bui-fg-${key}`] = value;
  });

  // Generate neutral background colors
  Object.entries({
    'neutral-0': palette.background.default,
    'neutral-1': palette.background.paper,
    'neutral-2': palette.background.default,
    'neutral-3': palette.background.default,
    solid: palette.primary.main,
    'solid-hover': blend(palette.primary.main, palette.primary.dark, 0.5),
    'solid-pressed': palette.primary.dark,
    'solid-disabled': palette.action.disabledBackground,
    danger: palette.error.light,
    warning: palette.warning.light,
    success: palette.success.light,
    info: palette.info?.light ?? alpha(palette.primary.main, 0.1),
  }).forEach(([key, value]) => {
    styleObject[`--bui-bg-${key}`] = value;
  });

  // Border colors
  Object.entries({
    danger: palette.error.main,
    warning: palette.warning.main,
    success: palette.success.main,
    info: palette.info?.main ?? palette.primary.main,
  }).forEach(([key, value]) => {
    styleObject[`--bui-border-${key}`] = value;
  });

  // Base border color if available
  styleObject['--bui-border'] = palette.border || palette.divider;
  styleObject['--bui-border-danger'] = palette.error.main;
  styleObject['--bui-border-warning'] = palette.warning.main;
  styleObject['--bui-border-success'] = palette.success.main;

  // Special colors
  styleObject['--bui-ring'] = palette.highlight || palette.primary.main;

  return styleObject;
}
