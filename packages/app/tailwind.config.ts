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
 * Extended Tailwind CSS configuration type that includes `corePlugins` for
 * controlling Tailwind's CSS reset (preflight) behavior. In Tailwind CSS v4
 * the `corePlugins` object is no longer part of the official typed `Config`
 * interface (preflight control is typically managed at the CSS layer), but the
 * property is preserved here to provide an explicit, configuration-level
 * opt-out of Tailwind's preflight reset. This is critical for MUI visual
 * coexistence — community plugins that still render MUI surfaces must not
 * have their baseline styles overridden by Tailwind's CSS reset.
 *
 * @see {@link https://tailwindcss.com/docs/preflight} Tailwind Preflight docs
 */
type BackstageTailwindConfig = Config & {
  corePlugins?: {
    preflight?: boolean;
    [key: string]: boolean | undefined;
  };
};

/**
 * Tailwind CSS v4 configuration for the `example-app` package
 * (`packages/app/`).
 *
 * This is the app-level Tailwind configuration that extends the design-token
 * integration established in `packages/core-components/tailwind.config.ts`.
 * It ensures Tailwind utility classes referenced by both app-level source
 * files **and** imported core-components are correctly included in the
 * generated CSS output.
 *
 * Configuration responsibilities:
 *
 *  1. **Content scanning paths** — Scans both the app's own `src/` directory
 *     **and** the `core-components/src/` directory so that every Tailwind
 *     class referenced across the import chain is detected and emitted.
 *     Without the core-components path, classes used exclusively inside
 *     shared components would be tree-shaken away in the app's CSS build.
 *
 *  2. **Semantic color tokens** — Maps CSS custom properties to Tailwind
 *     color utilities via the `var(--*)` pattern. The actual token values
 *     are defined in `packages/core-components/src/styles/globals.css` and
 *     resolve from the BUI token system (`packages/ui/src/css/tokens.css`).
 *     This indirection enables runtime theme switching (light ↔ dark) by
 *     swapping variable values at the `:root` /
 *     `[data-theme-mode="dark"]` level without recompiling Tailwind.
 *
 *  3. **Border radius** — Three-tier radius scale (`sm`, `md`, `lg`) derived
 *     from the `--radius` CSS custom property, aligned with BUI's
 *     `--bui-radius-3` (0.5rem) default value.
 *
 *  4. **Typography** — Dual-font system with `--font-sans` (system-ui stack
 *     from `--bui-font-regular`) for prose and navigation, and `--font-mono`
 *     (ui-monospace stack from `--bui-font-monospace`) for identifiers,
 *     metadata values, and code snippets.
 *
 *  5. **Animations** — Keyframe definitions for Radix UI Accordion expand and
 *     collapse transitions using `--radix-accordion-content-height` for
 *     smooth height animations.
 *
 *  6. **MUI coexistence** — Preflight is disabled via `corePlugins` to prevent
 *     Tailwind's CSS reset from interfering with MUI-rendered community
 *     plugin surfaces. Cascade layer isolation (`@layer base`, `@layer
 *     components`, `@layer utilities`) is managed in the global CSS entry
 *     points.
 *
 * BUI token mapping reference (light mode):
 *  | shadcn token      | BUI token           | Default value       |
 *  |-------------------|---------------------|---------------------|
 *  | --background      | --bui-bg-app        | #f8f8f8             |
 *  | --foreground      | --bui-fg-primary    | #000000             |
 *  | --primary         | --bui-bg-solid      | #1f5493             |
 *  | --destructive     | --bui-fg-danger     | #ec3b18             |
 *  | --muted           | --bui-bg-neutral-2  | ~#f0f0f0            |
 *  | --popover         | --bui-bg-popover    | #ffffff             |
 *  | --card            | --bui-bg-neutral-1  | #ffffff             |
 *  | --border          | --bui-border-1      | #d5d5d5             |
 *  | --ring            | --bui-ring          | #1f5493             |
 *  | --font-sans       | --bui-font-regular  | system-ui           |
 *  | --font-mono       | --bui-font-monospace| ui-monospace, …     |
 *  | --radius          | --bui-radius-3      | 0.5rem              |
 *
 * @see {@link https://ui.shadcn.com/docs/installation} shadcn/ui docs
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind CSS v4 docs
 * @see {@link packages/core-components/tailwind.config.ts} core-components config
 * @see {@link packages/ui/src/css/tokens.css} BUI token definitions
 * @see {@link packages/core-components/src/styles/globals.css} shadcn token definitions
 */
const config: BackstageTailwindConfig = {
  /*
   * ---------------------------------------------------------------------------
   * Dark mode
   * ---------------------------------------------------------------------------
   * Uses a selector strategy with Backstage's `[data-theme-mode="dark"]`
   * data attribute, matching the root Tailwind configuration and the
   * established `useApplyThemeAttributes` convention. Without this setting,
   * Tailwind's `dark:` variants would fall back to the default `media`
   * strategy (prefers-color-scheme) instead of the Backstage selector.
   */
  darkMode: ['selector', '[data-theme-mode="dark"]'],

  /*
   * ---------------------------------------------------------------------------
   * Content paths
   * ---------------------------------------------------------------------------
   * Scans TypeScript and TSX source files within the app package, the
   * core-components package, and the in-scope catalog plugins. This
   * multi-path scanning is essential because the app imports components
   * from @backstage/core-components and from the Backstage catalog
   * plugins (@backstage/plugin-catalog and @backstage/plugin-catalog-graph)
   * — without these content paths, Tailwind's purge step would remove
   * utility classes that are only referenced inside those packages/plugins
   * (e.g. `hover:border-foreground`, `group-hover:text-foreground` used
   * by the Entity Links card in @backstage/plugin-catalog).
   */
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/core-components/src/**/*.{ts,tsx}',
    '../../plugins/catalog/src/**/*.{ts,tsx}',
    '../../plugins/catalog-graph/src/**/*.{ts,tsx}',
  ],

  /*
   * ---------------------------------------------------------------------------
   * Theme extensions
   * ---------------------------------------------------------------------------
   * Extends Tailwind's default theme with the Backstage/shadcn design tokens.
   * All color values use the `var(--*)` pattern where the CSS custom property
   * contains the full color value (e.g. `#f8f8f8`). This keeps theme
   * switching purely CSS-driven — no Tailwind recompilation needed.
   */
  theme: {
    extend: {
      /*
       * -------------------------------------------------------------------
       * Colors
       * -------------------------------------------------------------------
       * Semantic color tokens following the shadcn/ui convention. Each token
       * references a CSS custom property whose value is set at the document
       * root for light mode and overridden under `[data-theme-mode="dark"]`
       * for dark mode.
       *
       * Color groups with a `DEFAULT` + `foreground` pair ensure that both
       * the surface color and its contrast text color are controlled by the
       * same semantic token namespace — e.g. `bg-primary` for the fill and
       * `text-primary-foreground` for text on top of it.
       */
      colors: {
        /* Semantic border color — form inputs, cards, dividers */
        border: 'var(--border)',

        /* Input field border and background tint */
        input: 'var(--input)',

        /* Focus ring indicator color */
        ring: 'var(--ring)',

        /* Global page background */
        background: 'var(--background)',

        /* Global default text color */
        foreground: 'var(--foreground)',

        /* Primary brand — CTAs, active states, links */
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },

        /* Secondary — less prominent actions, alternate surfaces */
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },

        /* Destructive / danger — delete actions, error states */
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },

        /* Muted — subtle backgrounds, disabled text, secondary content */
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },

        /* Accent — hover highlights, secondary emphasis */
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },

        /* Popover surfaces — dropdown menus, tooltips, popovers */
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        /* Card surfaces — info cards, entity detail panels */
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },

      /*
       * -------------------------------------------------------------------
       * Border radius
       * -------------------------------------------------------------------
       * Three-tier radius scale derived from the `--radius` CSS custom
       * property. The base value maps from BUI's `--bui-radius-3` (0.5rem).
       *
       * shadcn/ui components use `rounded-lg`, `rounded-md`, and
       * `rounded-sm` utilities which resolve to these values at runtime.
       */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /*
       * -------------------------------------------------------------------
       * Font families
       * -------------------------------------------------------------------
       * Dual-font system optimized for code-adjacent developer portal
       * content:
       *
       *  - `font-sans` → `--font-sans` ← `--bui-font-regular` (system-ui)
       *    Used for prose, navigation labels, and UI text.
       *
       *  - `font-mono` → `--font-mono` ← `--bui-font-monospace`
       *    (ui-monospace, Menlo, Monaco, Consolas, Liberation Mono, …)
       *    Used for entity identifiers, metadata values, and code snippets.
       */
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },

      /*
       * -------------------------------------------------------------------
       * Keyframes
       * -------------------------------------------------------------------
       * Animation keyframes for Radix UI Accordion primitives. These use
       * the `--radix-accordion-content-height` CSS custom property that
       * Radix sets at runtime to the measured natural height of the
       * accordion content, enabling smooth expand/collapse transitions.
       */
      keyframes: {
        /**
         * Accordion expand — animates from collapsed (height: 0) to the
         * natural content height provided by Radix Accordion.
         */
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },

        /**
         * Accordion collapse — animates from the natural content height
         * back to collapsed (height: 0).
         */
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      /*
       * -------------------------------------------------------------------
       * Animations
       * -------------------------------------------------------------------
       * Named animation utilities that map to the keyframes above. Usage:
       *   className="animate-accordion-down"
       *   className="animate-accordion-up"
       *
       * The 200ms ease-out timing provides a snappy, responsive feel that
       * is consistent with Radix UI defaults and the shadcn/ui design
       * language.
       */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  /*
   * ---------------------------------------------------------------------------
   * Plugins
   * ---------------------------------------------------------------------------
   * No additional Tailwind plugins are required for the app package.
   * Typography, form, and container-query plugins can be added here if needed
   * in the future.
   */
  plugins: [],

  /*
   * ---------------------------------------------------------------------------
   * Core plugins — MUI coexistence
   * ---------------------------------------------------------------------------
   * Disables Tailwind's preflight (CSS reset) to prevent it from overriding
   * baseline styles in community plugins that still render MUI components.
   *
   * Per AAP Section 0.8.1: "Tailwind's preflight reset must be scoped to
   * prevent bleeding into MUI-rendered plugin content." Disabling preflight
   * at the config level is the most reliable approach; any necessary reset
   * styles for shadcn/ui components are applied selectively via `@layer base`
   * in the global CSS entry point (`styles/globals.css`).
   */
  corePlugins: {
    preflight: false,
  },
};

export default config;
