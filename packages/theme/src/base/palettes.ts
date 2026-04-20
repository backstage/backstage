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
      default: '#0F0A1F',
      paper: '#1a1a2e',
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
      background: '#0F0A1F',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#1a1a2e',
      },
      submenu: {
        background: '#1a1a2e',
      },
    },
    pinSidebarButton: {
      icon: '#1a1a2e',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
};

/**
 * Normalizes a hex color string to its full 6-character uppercase form.
 *
 * Ensures consistent hex format for CSS custom property values, matching
 * the format used in the companion `shadcn-tokens.css` and `globals.css`
 * stylesheets. Tailwind CSS v4 consumes hex values directly via
 * `var(--token)` — the space-separated RGB format is no longer required.
 *
 * @param hex - Hex color string (e.g., '#F8F8F8', '#fff', or 'abc')
 * @returns Normalized hex string (e.g., '#F8F8F8')
 */
function normalizeHex(hex: string): string {
  const sanitized = hex.replace('#', '');
  const fullHex =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map(c => c + c)
          .join('')
      : sanitized;
  return `#${fullHex.toUpperCase()}`;
}

/**
 * Generates CSS custom property token declarations from a Backstage palette.
 *
 * Converts Backstage palette color values into shadcn/ui-compatible CSS custom
 * properties using hex color values. These tokens are injected by the
 * UnifiedThemeProvider at the document root level.
 *
 * The returned record maps CSS custom property names (e.g. `--background`,
 * `--primary`) to their computed hex values. This matches the format used in
 * `shadcn-tokens.css` and `globals.css` for consistent token representation
 * across TypeScript-generated and stylesheet-defined tokens.
 *
 * @public
 * @param palette - A Backstage palette object (e.g., `palettes.light` or `palettes.dark`)
 * @returns A Record mapping CSS custom property names to their hex color values
 */
export function generatePaletteTokens(
  palette: typeof palettes.light | typeof palettes.dark,
): Record<string, string> {
  // Neutral tone used for secondary/muted/accent backgrounds.
  // Light mode uses a near-white, dark mode reuses the paper surface.
  const neutralBg = palette.type === 'light' ? '#F5F5F5' : '#1a1a2e';

  return {
    // ── Core Layout ──────────────────────────────────────────────
    '--background': normalizeHex(palette.background.default),
    '--foreground': normalizeHex(palette.textContrast),

    // ── Card ─────────────────────────────────────────────────────
    '--card': normalizeHex(palette.background.paper),
    '--card-foreground': normalizeHex(palette.textContrast),

    // ── Popover ──────────────────────────────────────────────────
    // Dark mode popover uses #1a1a1a (BUI: --bui-bg-popover) instead of
    // palette.background.paper (#424242) to match the token definition in
    // globals.css. The popover surface should be darker than cards to
    // create visual depth hierarchy in the dark theme.
    '--popover':
      palette.type === 'dark'
        ? '#1A1A1A'
        : normalizeHex(palette.background.paper),
    '--popover-foreground':
      palette.type === 'dark' ? '#FFFFFF' : normalizeHex(palette.textContrast),

    // ── Primary ──────────────────────────────────────────────────
    '--primary': normalizeHex(palette.primary.main),
    // In dark mode the primary surface (#9CC9FF) is light, so the
    // foreground must be dark (#101821) for WCAG AA ≥4.5:1 contrast.
    // Light mode uses white on the dark primary (#1F5493).
    '--primary-foreground':
      palette.type === 'dark'
        ? '#101821'
        : normalizeHex(palette.bursts.fontColor),

    // ── Secondary ────────────────────────────────────────────────
    '--secondary': neutralBg,
    '--secondary-foreground': normalizeHex(palette.textContrast),

    // ── Muted ────────────────────────────────────────────────────
    '--muted': neutralBg,
    '--muted-foreground': normalizeHex(palette.textSubtle),

    // ── Accent ───────────────────────────────────────────────────
    '--accent': neutralBg,
    '--accent-foreground': normalizeHex(palette.textContrast),

    // ── Destructive ──────────────────────────────────────────────
    // In dark mode darken destructive to #B71C1C for WCAG AA ≥4.5:1
    // with white foreground (7.8:1). Light mode uses palette error directly.
    '--destructive':
      palette.type === 'dark' ? '#B71C1C' : normalizeHex(palette.status.error),
    '--destructive-foreground': '#FFFFFF',

    // ── Border / Input / Ring ────────────────────────────────────
    '--border': normalizeHex(palette.border),
    '--input': normalizeHex(palette.border),
    '--ring': normalizeHex(palette.primary.main),

    // ── Radius (non-color value) ─────────────────────────────────
    '--radius': '0.5rem',

    // ── Status Colors (catalog health / CI/CD displays) ──────────
    // Light mode: darkened for WCAG AA ≥4.5:1 on #F8F8F8 page background
    // Dark mode: lightened for WCAG AA ≥4.5:1 on #424242 card background
    '--status-ok':
      palette.type === 'light' ? '#0B7D37' : normalizeHex(palette.status.ok),
    '--status-warning':
      palette.type === 'light'
        ? '#A06000'
        : normalizeHex(palette.status.warning),
    '--status-error':
      palette.type === 'dark' ? '#FF9999' : normalizeHex(palette.status.error),
    '--status-running':
      palette.type === 'dark'
        ? '#79B8FF'
        : normalizeHex(palette.status.running),
    '--status-pending':
      palette.type === 'light'
        ? '#7A6C00'
        : normalizeHex(palette.status.pending),
    '--status-aborted': normalizeHex(palette.status.aborted),

    // ── Navigation (sidebar) ─────────────────────────────────────
    '--sidebar-background': normalizeHex(palette.navigation.background),
    '--sidebar-foreground': normalizeHex(palette.navigation.color),

    // ── Chart Tokens (data visualization) ────────────────────────
    // Five distinct palette-derived colors for charts, graphs, and
    // data visualization components. These follow the standard
    // shadcn/ui chart-* convention and are dynamically generated
    // from the active Backstage palette so they adapt to custom themes.
    '--chart-1': normalizeHex(palette.primary.main),
    '--chart-2': normalizeHex(palette.status.ok),
    '--chart-3': normalizeHex(palette.status.warning),
    '--chart-4': normalizeHex(palette.status.error),
    '--chart-5': normalizeHex(palette.gold),
  };
}
