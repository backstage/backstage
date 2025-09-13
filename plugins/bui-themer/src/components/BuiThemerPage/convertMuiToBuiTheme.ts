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
  styleObject['--bui-font-weight-regular'] = String(
    theme.typography.fontWeightRegular || 400,
  );
  styleObject['--bui-font-weight-bold'] = String(
    theme.typography.fontWeightBold || 600,
  );

  // Font sizes - map MUI typography scale to BUI scale
  const fontSizeMap = {
    h1: '--bui-font-size-10',
    h2: '--bui-font-size-8',
    h3: '--bui-font-size-7',
    h4: '--bui-font-size-6',
    h5: '--bui-font-size-5',
    h6: '--bui-font-size-4',
    body1: '--bui-font-size-4',
    body2: '--bui-font-size-3',
    caption: '--bui-font-size-2',
    overline: '--bui-font-size-1',
  };

  Object.entries(fontSizeMap).forEach(([muiKey, buiVar]) => {
    const typographyVariant =
      theme.typography[muiKey as keyof typeof theme.typography];
    const fontSize =
      typeof typographyVariant === 'object' && typographyVariant?.fontSize
        ? typographyVariant.fontSize
        : undefined;
    if (fontSize) {
      styleObject[buiVar] =
        typeof fontSize === 'string' ? fontSize : `${fontSize}px`;
    }
  });

  const spacing = theme.spacing(1);
  // Skip spacing if the theme is using the default
  if (spacing !== '8px') {
    styleObject['--bui-space'] = `calc(${spacing} * 0.5)`;
  }

  // Border radius
  if (theme.shape?.borderRadius) {
    const radius = theme.shape.borderRadius;
    const radiusValue = typeof radius === 'number' ? `${radius}px` : radius;
    styleObject['--bui-radius-3'] = radiusValue;
  }

  // Colors - map MUI palette to BUI color tokens
  const palette = theme.palette;

  // Base colors
  if (palette.common?.black) {
    styleObject['--bui-black'] = palette.common.black;
  }
  if (palette.common?.white) {
    styleObject['--bui-white'] = palette.common.white;
  }

  // Background colors
  if (palette.background?.default) {
    styleObject['--bui-bg'] = palette.background.default;
  }

  // Generate surface colors
  Object.entries({
    'surface-1': palette.background.paper,
    'surface-2': palette.background.default,
    solid: palette.primary.main,
    'solid-hover': blend(palette.primary.main, palette.primary.dark, 0.5),
    'solid-pressed': palette.primary.dark,
    'solid-disabled': palette.action.disabledBackground,
    tint: 'transparent',
    'tint-hover': alpha(palette.primary.main, 0.4),
    'tint-pressed': alpha(palette.primary.main, 0.6),
    'tint-disabled': palette.action.disabledBackground,
    danger: palette.error.light,
    warning: palette.warning.light,
    success: palette.success.light,
  }).forEach(([key, value]) => {
    styleObject[`--bui-bg-${key}`] = value;
  });

  // Foreground colors
  if (palette.text?.primary) {
    styleObject['--bui-fg-primary'] = palette.text.primary;
  }
  if (palette.text?.secondary) {
    styleObject['--bui-fg-secondary'] = palette.text.secondary;
  }

  // Generate foreground colors
  Object.entries({
    link: palette.primary.main,
    'link-hover': palette.primary.dark,
    disabled: palette.text.disabled,
    solid: palette.text.primary,
    'solid-disabled': palette.action.disabled,
    tint: palette.primary.main,
    'tint-disabled': palette.action.disabled,
    danger: palette.error.main,
    warning: palette.warning.main,
    success: palette.success.main,
  }).forEach(([key, value]) => {
    styleObject[`--bui-fg-${key}`] = value;
  });

  // Border colors
  Object.entries({
    danger: palette.error.main,
    warning: palette.warning.main,
    success: palette.success.main,
  }).forEach(([key, value]) => {
    styleObject[`--bui-border${key ? `-${key}` : ''}`] = value;
  });

  // Special colors
  if (palette.primary?.main) {
    styleObject['--bui-ring'] = palette.primary.main;
  }

  return styleObject;
}
