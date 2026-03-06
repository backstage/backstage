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
 * interface (preflight control is typically managed at the CSS layer), but
 * the property is preserved here to provide an explicit, configuration-level
 * opt-out of Tailwind's preflight reset. This is critical for MUI visual
 * coexistence — community plugins that still render MUI surfaces must not
 * have their baseline styles overridden by Tailwind's CSS reset.
 */
type BackstageTailwindConfig = Config & {
  corePlugins?: {
    preflight?: boolean;
    [key: string]: boolean | undefined;
  };
};

/**
 * Tailwind CSS v4 configuration for the `@backstage/core-components` package.
 *
 * This is the package-level Tailwind configuration that governs how Tailwind
 * utility classes are generated for the core-components source tree. It defines
 * the design-token integration layer between shadcn/ui components and the
 * Backstage design system. The configuration establishes:
 *
 *  1. **Content scanning paths** — Limits Tailwind's class-usage detection to
 *     the core-components `src/` directory so that only classes actually
 *     referenced in this package are included in the generated CSS.
 *
 *  2. **Semantic color tokens** — Maps CSS custom properties to Tailwind color
 *     utilities using the `var(--*)` pattern matching the root Tailwind
 *     convention. The actual token values are defined in `globals.css` and
 *     resolve from the existing BUI token system
 *     (`packages/ui/src/css/tokens.css`). This indirection enables runtime
 *     theme switching (light ↔ dark) by swapping variable values at the
 *     `:root` / `[data-theme-mode="dark"]` level without recompiling Tailwind.
 *
 *  3. **Border radius** — Three-tier radius scale (`sm`, `md`, `lg`) derived
 *     from the `--radius` CSS custom property, aligned with BUI's
 *     `--bui-radius-3` (0.5rem) default value.
 *
 *  4. **Typography** — Dual-font system with `--font-sans` (system-ui stack)
 *     for prose and navigation, and `--font-mono` (ui-monospace stack) for
 *     identifiers, metadata values, and code content.
 *
 *  5. **Animations** — Keyframe definitions for Radix UI Accordion expand and
 *     collapse transitions using `--radix-accordion-content-height` for
 *     smooth height animations.
 *
 *  6. **MUI coexistence** — Preflight is disabled via `corePlugins` to prevent
 *     Tailwind's CSS reset from interfering with MUI-rendered community plugin
 *     surfaces. Cascade layer isolation (`@layer base`, `@layer components`,
 *     `@layer utilities`) is managed in the CSS entry points.
 *
 * BUI token mapping reference (light mode):
 *  | shadcn token      | BUI token           | Default value       |
 *  |-------------------|---------------------|---------------------|
 *  | --background      | --bui-bg-app        | #f8f8f8             |
 *  | --foreground      | --bui-fg-primary    | #000000             |
 *  | --primary         | --bui-bg-solid      | #1f5493             |
 *  | --destructive     | --bui-bg-danger     | #ffe2e2             |
 *  | --muted           | --bui-bg-neutral-2  | oklch(0% 0 0 / 6%) |
 *  | --popover         | --bui-bg-popover    | #ffffff             |
 *  | --card            | --bui-bg-neutral-1  | #ffffff             |
 *  | --border          | --bui-border-1      | #d5d5d5             |
 *  | --ring            | --bui-ring          | #1f5493             |
 *
 * @see {@link https://ui.shadcn.com/docs/installation} shadcn/ui docs
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind CSS v4 docs
 * @see {@link packages/ui/src/css/tokens.css} BUI token definitions
 */
const config: BackstageTailwindConfig = {
  /*
   * ---------------------------------------------------------------------------
   * Content paths
   * ---------------------------------------------------------------------------
   * Scans all TypeScript and TSX source files within core-components for
   * Tailwind utility class usage. This ensures the generated CSS includes
   * only the classes referenced by components in this package.
   */
  content: ['./src/**/*.{ts,tsx}'],

  /*
   * ---------------------------------------------------------------------------
   * Theme extensions
   * ---------------------------------------------------------------------------
   * Extends Tailwind's default theme with the Backstage/shadcn design tokens.
   * All color values use the `var(--*)` pattern where the CSS custom
   * property contains the full color value (e.g. `#f8f8f8`). This
   * keeps theme switching purely CSS-driven.
   */
  theme: {
    extend: {
      /*
       * ---------------------------------------------------------------------
       * Colors
       * ---------------------------------------------------------------------
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

        /* Sidebar surfaces — collapsible navigation rail */
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },

        /* Status colors — catalog health, CI/CD displays */
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
       * ---------------------------------------------------------------------
       * Border radius
       * ---------------------------------------------------------------------
       * Three-tier radius scale derived from the `--radius` CSS custom
       * property. The base value maps from BUI's `--bui-radius-3` (0.5rem).
       *
       * shadcn/ui components use `rounded-lg`, `rounded-md`, and `rounded-sm`
       * utilities which resolve to these values at runtime.
       */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /*
       * ---------------------------------------------------------------------
       * Font families
       * ---------------------------------------------------------------------
       * Dual-font system optimized for code-adjacent developer portal content:
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
       * ---------------------------------------------------------------------
       * Keyframes
       * ---------------------------------------------------------------------
       * Animation keyframes for Radix UI Accordion primitives. These use the
       * `--radix-accordion-content-height` CSS custom property that Radix
       * sets at runtime to the measured natural height of the accordion
       * content, enabling smooth expand/collapse transitions.
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

        /**
         * Collapsible expand — animates from collapsed (height: 0) to the
         * natural content height provided by Radix Collapsible.
         */
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },

        /**
         * Collapsible collapse — animates from the natural content height
         * back to collapsed (height: 0).
         */
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },

      /*
       * ---------------------------------------------------------------------
       * Animations
       * ---------------------------------------------------------------------
       * Named animation utilities that map to the keyframes above. Usage:
       *   className="animate-accordion-down"
       *   className="animate-accordion-up"
       *
       * The 200ms ease-out timing provides a snappy, responsive feel that is
       * consistent with Radix UI defaults and the shadcn/ui design language.
       */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out forwards',
        'accordion-up': 'accordion-up 0.2s ease-out forwards',
        'collapsible-down': 'collapsible-down 0.2s ease-out forwards',
        'collapsible-up': 'collapsible-up 0.2s ease-out forwards',
      },

      /*
       * ---------------------------------------------------------------------
       * Responsive breakpoints
       * ---------------------------------------------------------------------
       * MUI-compatible breakpoints matching Backstage's existing responsive
       * conventions. Maps Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
       * to the same pixel values used by the MUI theme in packages/theme.
       */
      screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
      },
    },
  },

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
