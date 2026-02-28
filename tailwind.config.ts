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

import type { Config } from 'tailwindcss';

/**
 * Monorepo root Tailwind CSS v4 configuration for the Backstage Developer Portal.
 *
 * This shared preset serves as the single source of truth for the Tailwind CSS
 * design system across all in-scope packages and plugins. Individual package-level
 * configs (e.g. `packages/core-components/tailwind.config.ts`) can extend this
 * preset via the `presets` option.
 *
 * The color tokens reference CSS custom properties (`var(--*)`) defined in the
 * globals.css stylesheet, which maps from the existing BUI token system
 * (`packages/ui/src/css/tokens.css`) to shadcn/ui conventions. This indirection
 * enables runtime theme switching (light ↔ dark) by swapping token values at
 * the `:root` / `[data-theme-mode="dark"]` level without recompiling Tailwind.
 *
 * Build integrations:
 *  - `@tailwindcss/vite` for Vite ^7.1.5 dev/build pipeline
 *  - `@tailwindcss/postcss` for PostCSS processing (see `postcss.config.js`)
 *
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind CSS v4 docs
 * @see {@link packages/ui/src/css/tokens.css} BUI token definitions
 */
const config: Config = {
  /*
   * ---------------------------------------------------------------------------
   * Content paths
   * ---------------------------------------------------------------------------
   * Specifies the files Tailwind should scan for utility class usage. Covers
   * every in-scope package and plugin in the Backstage monorepo as defined in
   * AAP Section 0.3.1.
   */
  content: [
    './packages/core-components/src/**/*.{ts,tsx}',
    './packages/app/src/**/*.{ts,tsx}',
    './packages/app-defaults/src/**/*.{ts,tsx}',
    './packages/theme/src/**/*.{ts,tsx}',
    './plugins/catalog/src/**/*.{ts,tsx}',
    './plugins/catalog-react/src/**/*.{ts,tsx}',
    './plugins/scaffolder/src/**/*.{ts,tsx}',
    './plugins/scaffolder-react/src/**/*.{ts,tsx}',
    './plugins/techdocs/src/**/*.{ts,tsx}',
    './plugins/techdocs-react/src/**/*.{ts,tsx}',
    './plugins/search/src/**/*.{ts,tsx}',
    './plugins/search-react/src/**/*.{ts,tsx}',
    './plugins/user-settings/src/**/*.{ts,tsx}',
  ],

  /*
   * ---------------------------------------------------------------------------
   * Dark mode strategy
   * ---------------------------------------------------------------------------
   * Uses the `selector` strategy with Backstage's existing `data-theme-mode`
   * data attribute convention. Dark mode is activated when the closest ancestor
   * element has `data-theme-mode="dark"` set.
   *
   * This preserves backward compatibility with Backstage's existing theming
   * infrastructure where `UnifiedThemeProvider` sets this attribute on the
   * document root.
   */
  darkMode: ['selector', '[data-theme-mode="dark"]'],

  /*
   * ---------------------------------------------------------------------------
   * Important
   * ---------------------------------------------------------------------------
   * Set to `false` to prevent Tailwind utilities from being marked as
   * `!important`. This avoids overriding styles in community plugins that
   * still use MUI internally, ensuring visual coexistence between shadcn/ui
   * core surfaces and MUI plugin surfaces during the transition period.
   */
  important: false,

  /*
   * ---------------------------------------------------------------------------
   * Theme extensions
   * ---------------------------------------------------------------------------
   * Extends Tailwind's default theme with the Backstage design system tokens.
   * All color values reference CSS custom properties that are defined in the
   * global stylesheet (`globals.css`), which maps BUI tokens to shadcn/ui
   * conventions. This approach enables:
   *
   *  1. Runtime light/dark theme switching via CSS custom property overrides
   *  2. Zero JavaScript overhead for theme application
   *  3. Alignment with the existing BUI token vocabulary
   *  4. WCAG 2.1 AA contrast compliance in both modes
   */
  theme: {
    extend: {
      /*
       * -----------------------------------------------------------------------
       * Colors
       * -----------------------------------------------------------------------
       * Semantic color tokens following shadcn/ui conventions. Each token
       * resolves to a CSS custom property at runtime:
       *
       *  - Light mode values set on `:root`
       *  - Dark mode values set on `[data-theme-mode="dark"]`
       *
       * BUI token mapping (light mode reference values):
       *  --background     ← --bui-bg-app       (#f8f8f8)
       *  --foreground     ← --bui-fg-primary    (#000000)
       *  --primary        ← --bui-bg-solid      (#1f5493)
       *  --destructive    ← --bui-bg-danger     (#ffe2e2)
       *  --muted          ← --bui-bg-neutral-2  (oklch 6%)
       *  --popover        ← --bui-bg-popover    (#ffffff)
       *  --card           ← --bui-bg-neutral-1  (#fff)
       *  --border         ← --bui-border-1      (#d5d5d5)
       *  --ring           ← --bui-ring          (#1f5493)
       *  --warning        ← --bui-bg-warning    (#ffedd5)
       *  --success        ← --bui-bg-success    (#dcfce7)
       *  --info           ← --bui-bg-info       (#dbeafe)
       */
      colors: {
        /* Global surface and text colors */
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        /* Primary brand color — used for CTAs, active states, links */
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },

        /* Secondary color — used for less prominent actions */
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },

        /* Destructive / danger — used for delete actions, error states */
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },

        /* Muted — used for subtle backgrounds, disabled text */
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },

        /* Accent — used for hover highlights, secondary emphasis */
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },

        /* Popover surface — dropdown menus, tooltips, popovers */
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        /* Card surface — info cards, entity detail panels */
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        /* Semantic border and input colors */
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        /* Status colors — catalog health, CI/CD indicators */
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
      },

      /*
       * -----------------------------------------------------------------------
       * Border radius
       * -----------------------------------------------------------------------
       * Three-tier radius scale derived from the BUI radius system:
       *  --radius ← --bui-radius-3 (0.5rem)
       *
       * shadcn/ui components use `rounded-lg`, `rounded-md`, `rounded-sm`
       * utilities which map to these values.
       */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /*
       * -----------------------------------------------------------------------
       * Font families
       * -----------------------------------------------------------------------
       * Dual-font system for code-adjacent content:
       *  - `font-sans` for prose, navigation, and UI labels
       *  - `font-mono` for identifiers, metadata values, and code content
       *
       * Token mapping:
       *  --font-sans ← --bui-font-regular  (system-ui)
       *  --font-mono ← --bui-font-monospace (ui-monospace, Menlo, ...)
       */
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
        mono: ['var(--font-mono)'],
      },

      /*
       * -----------------------------------------------------------------------
       * Keyframes
       * -----------------------------------------------------------------------
       * Animation keyframes required by shadcn/ui components built on Radix UI
       * primitives. These use Radix CSS custom properties to animate content
       * height transitions for accordion and collapsible components.
       */
      keyframes: {
        /**
         * Accordion expand animation.
         * Animates from collapsed (height: 0) to the natural content height
         * provided by Radix Accordion via `--radix-accordion-content-height`.
         */
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },

        /**
         * Accordion collapse animation.
         * Animates from the natural content height back to collapsed (height: 0).
         */
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        /**
         * Collapsible expand animation.
         * Used by Radix Collapsible primitive for content reveal transitions.
         */
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },

        /**
         * Collapsible collapse animation.
         * Used by Radix Collapsible primitive for content hide transitions.
         */
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },

      /*
       * -----------------------------------------------------------------------
       * Animations
       * -----------------------------------------------------------------------
       * Named animation utilities that reference the keyframes defined above.
       * Usage: `className="animate-accordion-down"` in shadcn/ui components.
       *
       * Timing: 200ms ease-out provides a snappy feel consistent with Radix UI
       * defaults and the shadcn/ui design language.
       */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
      },

      /*
       * -----------------------------------------------------------------------
       * Responsive breakpoints
       * -----------------------------------------------------------------------
       * Maps Tailwind's responsive prefixes to Backstage's established MUI v4
       * breakpoint values. This ensures that responsive utility classes
       * (`sm:`, `md:`, `lg:`, `xl:`) trigger at the same viewport widths
       * that existing MUI-based components use.
       *
       * Per AAP Section 0.8.1: "Do not introduce new breakpoint values —
       * map Tailwind's responsive prefixes to Backstage's established
       * breakpoint widths."
       *
       * MUI v4 defaults:
       *  xs: 0px, sm: 600px, md: 960px, lg: 1280px, xl: 1920px
       */
      screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
      },
    },
  },
};

export default config;
