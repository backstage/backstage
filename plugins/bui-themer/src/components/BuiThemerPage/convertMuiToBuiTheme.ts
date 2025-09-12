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

  // Gray scale - generate from primary color or use defaults
  const grayScale = generateGrayScale(palette.mode === 'dark');
  Object.entries(grayScale).forEach(([key, value]) => {
    variables.push(`  --bui-gray-${key}: ${value};`);
  });

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
 * Generates gray scale colors
 */
function generateGrayScale(isDark: boolean): Record<string, string> {
  if (isDark) {
    return {
      '1': '#191919',
      '2': '#242424',
      '3': '#373737',
      '4': '#464646',
      '5': '#575757',
      '6': '#7b7b7b',
      '7': '#9e9e9e',
      '8': '#b4b4b4',
    };
  }

  return {
    '1': '#f8f8f8',
    '2': '#ececec',
    '3': '#d9d9d9',
    '4': '#c1c1c1',
    '5': '#9e9e9e',
    '6': '#8c8c8c',
    '7': '#757575',
    '8': '#595959',
  };
}

/**
 * Generates surface background colors
 */
function generateSurfaceColors(
  palette: Mui5Theme['palette'],
): Record<string, string> {
  const isDark = palette.mode === 'dark';

  // Helper function to get tint colors with proper fallbacks
  const getTintColor = (opacity: string) => {
    if (palette.primary?.main) {
      return `${palette.primary.main}${opacity}`;
    }
    return isDark
      ? `rgba(156, 201, 255, ${opacity === '40' ? '0.12' : '0.16'})`
      : `rgba(31, 84, 147, ${opacity === '40' ? '0.4' : '0.6'})`;
  };

  // Helper function to get fallback colors based on theme mode
  const getFallbackColor = (lightColor: string, darkColor: string) => {
    return isDark ? darkColor : lightColor;
  };

  return {
    'surface-2': getFallbackColor('#ececec', '#242424'),
    solid: palette.primary?.main || getFallbackColor('#1f5493', '#9cc9ff'),
    'solid-hover':
      palette.primary?.dark || getFallbackColor('#163a66', '#83b9fd'),
    'solid-pressed':
      palette.primary?.dark || getFallbackColor('#0f2b4e', '#83b9fd'),
    'solid-disabled': getFallbackColor('#ebebeb', '#222222'),
    tint: 'transparent',
    'tint-hover': getTintColor('40'),
    'tint-pressed': getTintColor('60'),
    'tint-disabled': getFallbackColor('#ebebeb', 'transparent'),
    danger: palette.error?.light || getFallbackColor('#feebe7', '#3b1219'),
    warning: palette.warning?.light || getFallbackColor('#fff2b2', '#302008'),
    success: palette.success?.light || getFallbackColor('#e6f6eb', '#132d21'),
  };
}

/**
 * Generates foreground colors
 */
function generateForegroundColors(
  palette: Mui5Theme['palette'],
): Record<string, string> {
  const isDark = palette.mode === 'dark';

  return {
    link: palette.primary?.main || (isDark ? '#9cc9ff' : '#1f5493'),
    'link-hover': palette.primary?.dark || (isDark ? '#7eb5f7' : '#1f2d5c'),
    disabled: palette.text?.disabled || (isDark ? '#9e9e9e' : '#9e9e9e'),
    solid: isDark ? '#101821' : '#ffffff',
    'solid-disabled': isDark ? '#575757' : '#9c9c9c',
    tint: palette.primary?.main || (isDark ? '#9cc9ff' : '#1f5493'),
    'tint-disabled': isDark ? '#575757' : '#9e9e9e',
    danger: palette.error?.main || '#e22b2b',
    warning: palette.warning?.main || '#e36d05',
    success: palette.success?.main || '#1db954',
  };
}

/**
 * Generates border colors
 */
function generateBorderColors(
  palette: Mui5Theme['palette'],
): Record<string, string> {
  const isDark = palette.mode === 'dark';

  return {
    '': isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
    hover: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)',
    pressed: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
    disabled: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    danger: palette.error?.main || '#f87a7a',
    warning: palette.warning?.main || '#e36d05',
    success: palette.success?.main || '#53db83',
  };
}
