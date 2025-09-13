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
import { themes } from '@backstage/theme';

export interface ConvertMuiToBuiThemeOptions {
  /**
   * Theme ID to use for scoping CSS variables
   */
  themeId?: string;
  /**
   * Whether to include theme ID scoping in the CSS
   */
  includeThemeId?: boolean;
}

/**
 * Converts a MUI v5 Theme to BUI CSS variables
 * @param theme - The MUI v5 theme to convert
 * @param options - Conversion options
 * @returns CSS string with BUI variables
 */
export function convertMuiToBuiTheme(
  theme: Mui5Theme,
  options: ConvertMuiToBuiThemeOptions = {},
): string {
  // Early validation of required theme properties
  if (!theme) {
    throw new Error('Theme is required');
  }

  if (!theme.palette) {
    throw new Error('Theme palette is required');
  }

  if (!theme.palette.mode) {
    throw new Error('Theme palette mode is required');
  }

  if (!theme.typography) {
    throw new Error('Theme typography is required');
  }

  if (!theme.spacing) {
    throw new Error('Theme spacing is required');
  }

  if (!theme.shape) {
    throw new Error('Theme shape is required');
  }

  const { themeId, includeThemeId = false } = options;
  const isDark = theme.palette.mode === 'dark';

  // Generate CSS variables based on theme
  const variables = generateBuiVariables(theme);

  // Create CSS selector based on theme mode and ID
  let selector = isDark ? "[data-theme-mode='dark']" : ':root';
  if (includeThemeId && themeId) {
    selector = `[data-app-theme='${themeId}'] ${selector}`;
  }

  return `${selector} {\n${variables}\n}`;
}

/**
 * Generates BUI CSS variables from MUI theme
 */
function generateBuiVariables(theme: Mui5Theme): string {
  const variables: string[] = [];

  // Font families
  if (theme.typography.fontFamily) {
    variables.push(`  --bui-font-regular: ${theme.typography.fontFamily};`);
  }

  // Font weights
  variables.push(
    `  --bui-font-weight-regular: ${
      theme.typography.fontWeightRegular || 400
    };`,
  );
  variables.push(
    `  --bui-font-weight-bold: ${theme.typography.fontWeightBold || 600};`,
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
      variables.push(`  ${buiVar}: ${fontSize};`);
    }
  });

  // Spacing - map MUI spacing to BUI spacing scale
  if (theme.spacing) {
    const spacingUnit =
      typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing;
    const spacingValue =
      typeof spacingUnit === 'number' ? `${spacingUnit}px` : spacingUnit;
    variables.push(`  --bui-space: ${spacingValue};`);
  }

  // Border radius
  if (theme.shape?.borderRadius) {
    const radius = theme.shape.borderRadius;
    const radiusValue = typeof radius === 'number' ? `${radius}px` : radius;
    variables.push(`  --bui-radius-3: ${radiusValue};`);
  }

  // Colors - map MUI palette to BUI color tokens
  const palette = theme.palette;

  // Base colors
  if (palette.common?.black) {
    variables.push(`  --bui-black: ${palette.common.black};`);
  }
  if (palette.common?.white) {
    variables.push(`  --bui-white: ${palette.common.white};`);
  }

  // Background colors
  if (palette.background?.default) {
    variables.push(`  --bui-bg: ${palette.background.default};`);
  }
  if (palette.background?.paper) {
    variables.push(`  --bui-bg-surface-1: ${palette.background.paper};`);
  }

  // Generate surface colors
  const surfaceColors = generateSurfaceColors(palette);
  Object.entries(surfaceColors).forEach(([key, value]) => {
    variables.push(`  --bui-bg-${key}: ${value};`);
  });

  // Foreground colors
  if (palette.text?.primary) {
    variables.push(`  --bui-fg-primary: ${palette.text.primary};`);
  }
  if (palette.text?.secondary) {
    variables.push(`  --bui-fg-secondary: ${palette.text.secondary};`);
  }

  // Generate foreground colors
  const foregroundColors = generateForegroundColors(palette);
  Object.entries(foregroundColors).forEach(([key, value]) => {
    variables.push(`  --bui-fg-${key}: ${value};`);
  });

  // Border colors
  const borderColors = generateBorderColors(palette);
  Object.entries(borderColors).forEach(([key, value]) => {
    variables.push(`  --bui-border${key ? `-${key}` : ''}: ${value};`);
  });

  // Special colors
  if (palette.primary?.main) {
    variables.push(`  --bui-ring: ${palette.primary.main};`);
  }

  return variables.join('\n');
}

/**
 * Generates surface background colors
 */
function generateSurfaceColors(
  palette: Mui5Theme['palette'],
): Record<string, string> {
  const isDark = palette.mode === 'dark';

  // Get the default Backstage theme for fallback values
  const defaultTheme = isDark ? themes.dark : themes.light;
  const defaultMuiTheme = defaultTheme.getTheme('v5');

  if (!defaultMuiTheme) {
    throw new Error(
      `Failed to get MUI v5 theme from Backstage ${
        isDark ? 'dark' : 'light'
      } theme`,
    );
  }

  const defaultPalette = defaultMuiTheme.palette;
  if (!defaultPalette) {
    throw new Error(
      `Failed to get palette from Backstage ${isDark ? 'dark' : 'light'} theme`,
    );
  }

  // Helper function to get tint colors
  const getTintColor = (opacity: string) => {
    const primaryColor = palette.primary?.main || defaultPalette.primary?.main;
    if (!primaryColor) {
      throw new Error('Primary color not found in current or default theme');
    }
    return `${primaryColor}${opacity}`;
  };

  // Helper function to get colors based on theme mode
  const getThemeColor = (lightColor: string, darkColor: string) => {
    return isDark ? darkColor : lightColor;
  };

  return {
    'surface-2': getThemeColor('#ececec', '#242424'),
    solid:
      palette.primary?.main ||
      defaultPalette.primary?.main ||
      (() => {
        throw new Error('Primary color not found in current or default theme');
      })(),
    'solid-hover':
      palette.primary?.dark ||
      defaultPalette.primary?.dark ||
      (() => {
        throw new Error(
          'Primary dark color not found in current or default theme',
        );
      })(),
    'solid-pressed':
      palette.primary?.dark ||
      defaultPalette.primary?.dark ||
      (() => {
        throw new Error(
          'Primary dark color not found in current or default theme',
        );
      })(),
    'solid-disabled': getThemeColor('#ebebeb', '#222222'),
    tint: 'transparent',
    'tint-hover': getTintColor('40'),
    'tint-pressed': getTintColor('60'),
    'tint-disabled': getThemeColor('#ebebeb', 'transparent'),
    danger:
      palette.error?.light ||
      defaultPalette.error?.light ||
      (() => {
        throw new Error(
          'Error light color not found in current or default theme',
        );
      })(),
    warning:
      palette.warning?.light ||
      defaultPalette.warning?.light ||
      (() => {
        throw new Error(
          'Warning light color not found in current or default theme',
        );
      })(),
    success:
      palette.success?.light ||
      defaultPalette.success?.light ||
      (() => {
        throw new Error(
          'Success light color not found in current or default theme',
        );
      })(),
  };
}

/**
 * Generates foreground colors
 */
function generateForegroundColors(
  palette: Mui5Theme['palette'],
): Record<string, string> {
  const isDark = palette.mode === 'dark';

  // Get the default Backstage theme for fallback values
  const defaultTheme = isDark ? themes.dark : themes.light;
  const defaultMuiTheme = defaultTheme.getTheme('v5');

  if (!defaultMuiTheme) {
    throw new Error(
      `Failed to get MUI v5 theme from Backstage ${
        isDark ? 'dark' : 'light'
      } theme`,
    );
  }

  const defaultPalette = defaultMuiTheme.palette;
  if (!defaultPalette) {
    throw new Error(
      `Failed to get palette from Backstage ${isDark ? 'dark' : 'light'} theme`,
    );
  }

  return {
    link:
      palette.primary?.main ||
      defaultPalette.primary?.main ||
      (() => {
        throw new Error('Primary color not found in current or default theme');
      })(),
    'link-hover':
      palette.primary?.dark ||
      defaultPalette.primary?.dark ||
      (() => {
        throw new Error(
          'Primary dark color not found in current or default theme',
        );
      })(),
    disabled:
      palette.text?.disabled ||
      defaultPalette.text?.disabled ||
      (() => {
        throw new Error(
          'Text disabled color not found in current or default theme',
        );
      })(),
    solid: isDark ? '#101821' : '#ffffff',
    'solid-disabled': isDark ? '#575757' : '#9c9c9c',
    tint:
      palette.primary?.main ||
      defaultPalette.primary?.main ||
      (() => {
        throw new Error('Primary color not found in current or default theme');
      })(),
    'tint-disabled': isDark ? '#575757' : '#9e9e9e',
    danger:
      palette.error?.main ||
      defaultPalette.error?.main ||
      (() => {
        throw new Error('Error color not found in current or default theme');
      })(),
    warning:
      palette.warning?.main ||
      defaultPalette.warning?.main ||
      (() => {
        throw new Error('Warning color not found in current or default theme');
      })(),
    success:
      palette.success?.main ||
      defaultPalette.success?.main ||
      (() => {
        throw new Error('Success color not found in current or default theme');
      })(),
  };
}

/**
 * Generates border colors
 */
function generateBorderColors(
  palette: Mui5Theme['palette'],
): Record<string, string> {
  const isDark = palette.mode === 'dark';

  // Get the default Backstage theme for fallback values
  const defaultTheme = isDark ? themes.dark : themes.light;
  const defaultMuiTheme = defaultTheme.getTheme('v5');

  if (!defaultMuiTheme) {
    throw new Error(
      `Failed to get MUI v5 theme from Backstage ${
        isDark ? 'dark' : 'light'
      } theme`,
    );
  }

  const defaultPalette = defaultMuiTheme.palette;
  if (!defaultPalette) {
    throw new Error(
      `Failed to get palette from Backstage ${isDark ? 'dark' : 'light'} theme`,
    );
  }

  return {
    '': isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
    hover: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)',
    pressed: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
    disabled: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    danger:
      palette.error?.main ||
      defaultPalette.error?.main ||
      (() => {
        throw new Error('Error color not found in current or default theme');
      })(),
    warning:
      palette.warning?.main ||
      defaultPalette.warning?.main ||
      (() => {
        throw new Error('Warning color not found in current or default theme');
      })(),
    success:
      palette.success?.main ||
      defaultPalette.success?.main ||
      (() => {
        throw new Error('Success color not found in current or default theme');
      })(),
  };
}
