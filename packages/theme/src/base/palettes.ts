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

/**
 * Built-in Backstage color palettes.
 *
 * @public
 */
export const palettes = {
  light: {
    type: 'light' as const,
    mode: 'light' as const,
    background: {
      default: '#F8F8F8',
      paper: '#FFFFFF',
    },
    status: {
      ok: '#1DB954',
      warning: '#FF9800',
      error: '#E22134',
      running: '#1F5493',
      pending: '#FFED51',
      aborted: '#757575',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
      },
    },
    primary: {
      main: '#1F5493',
    },
    banner: {
      info: '#2E77D0',
      error: '#E22134',
      text: '#FFFFFF',
      link: '#000000',
      closeButtonColor: '#FFFFFF',
      warning: '#FF9800',
    },
    border: '#E6E6E6',
    textContrast: '#000000',
    textVerySubtle: '#DDD',
    textSubtle: '#6E6E6E',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#2196F3',
    link: '#0A6EBE',
    gold: '#FFD600',
    navigation: {
      background: '#171717',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#404040',
      },
      submenu: {
        background: '#404040',
      },
    },
    pinSidebarButton: {
      icon: '#181818',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
  dark: {
    type: 'dark' as const,
    mode: 'dark' as const,
    background: {
      default: '#333333',
      paper: '#424242',
    },
    status: {
      ok: '#71CF88',
      warning: '#FFB84D',
      error: '#F84C55',
      running: '#3488E3',
      pending: '#FEF071',
      aborted: '#9E9E9E',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
      },
    },
    primary: {
      main: '#9CC9FF',
      dark: '#82BAFD',
    },
    secondary: {
      main: '#FF88B2',
    },
    banner: {
      info: '#2E77D0',
      error: '#E22134',
      text: '#FFFFFF',
      link: '#000000',
      closeButtonColor: '#FFFFFF',
      warning: '#FF9800',
    },
    border: '#E6E6E6',
    textContrast: '#FFFFFF',
    textVerySubtle: '#727272',
    textSubtle: '#CCCCCC',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#82BAFD',
    link: '#9CC9FF',
    gold: '#FFD600',
    navigation: {
      background: '#424242',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#404040',
      },
      submenu: {
        background: '#404040',
      },
    },
    pinSidebarButton: {
      icon: '#404040',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
};

/**
 * Converts a hex color string to space-separated RGB values.
 * Used internally for shadcn/ui CSS custom properties that support
 * Tailwind's opacity modifier syntax: `rgb(var(--color) / 0.5)`.
 *
 * @param hex - Hex color string (e.g., '#F8F8F8' or '#fff')
 * @returns Space-separated RGB string (e.g., '248 248 248')
 */
function hexToRgb(hex: string): string {
  const sanitized = hex.replace('#', '');
  const fullHex =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map(c => c + c)
          .join('')
      : sanitized;
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Generates CSS custom property token declarations from a Backstage palette.
 *
 * Converts Backstage palette color values into shadcn/ui-compatible CSS custom
 * properties using space-separated RGB values. These tokens are injected by
 * the UnifiedThemeProvider at the document root level.
 *
 * The returned record maps CSS custom property names (e.g. `--background`,
 * `--primary`) to their computed values. Color tokens use space-separated RGB
 * (e.g. `'248 248 248'`) to support Tailwind's opacity modifier syntax, while
 * non-color tokens like `--radius` use their native CSS value.
 *
 * @public
 * @param palette - A Backstage palette object (e.g., `palettes.light` or `palettes.dark`)
 * @returns A Record mapping CSS custom property names to their RGB values
 */
export function generatePaletteTokens(
  palette: typeof palettes.light | typeof palettes.dark,
): Record<string, string> {
  // Neutral tone used for secondary/muted/accent backgrounds.
  // Light mode uses a near-white (#F5F5F5 = 245 245 245),
  // dark mode reuses the paper surface (#424242 = 66 66 66).
  const neutralBg = palette.type === 'light' ? '245 245 245' : '66 66 66';

  return {
    // ── Core Layout ──────────────────────────────────────────────
    '--background': hexToRgb(palette.background.default),
    '--foreground': hexToRgb(palette.textContrast),

    // ── Card ─────────────────────────────────────────────────────
    '--card': hexToRgb(palette.background.paper),
    '--card-foreground': hexToRgb(palette.textContrast),

    // ── Popover ──────────────────────────────────────────────────
    '--popover': hexToRgb(palette.background.paper),
    '--popover-foreground': hexToRgb(palette.textContrast),

    // ── Primary ──────────────────────────────────────────────────
    '--primary': hexToRgb(palette.primary.main),
    '--primary-foreground': hexToRgb(palette.bursts.fontColor),

    // ── Secondary ────────────────────────────────────────────────
    '--secondary': neutralBg,
    '--secondary-foreground': hexToRgb(palette.textContrast),

    // ── Muted ────────────────────────────────────────────────────
    '--muted': neutralBg,
    '--muted-foreground': hexToRgb(palette.textSubtle),

    // ── Accent ───────────────────────────────────────────────────
    '--accent': neutralBg,
    '--accent-foreground': hexToRgb(palette.textContrast),

    // ── Destructive ──────────────────────────────────────────────
    '--destructive': hexToRgb(palette.status.error),
    '--destructive-foreground': '255 255 255',

    // ── Border / Input / Ring ────────────────────────────────────
    '--border': hexToRgb(palette.border),
    '--input': hexToRgb(palette.border),
    '--ring': hexToRgb(palette.primary.main),

    // ── Radius (non-RGB value) ───────────────────────────────────
    '--radius': '0.5rem',

    // ── Status Colors (catalog health / CI/CD displays) ──────────
    '--status-ok': hexToRgb(palette.status.ok),
    '--status-warning': hexToRgb(palette.status.warning),
    '--status-error': hexToRgb(palette.status.error),
    '--status-running': hexToRgb(palette.status.running),
    '--status-pending': hexToRgb(palette.status.pending),
    '--status-aborted': hexToRgb(palette.status.aborted),

    // ── Navigation (sidebar) ─────────────────────────────────────
    '--sidebar-background': hexToRgb(palette.navigation.background),
    '--sidebar-foreground': hexToRgb(palette.navigation.color),
  };
}
