/*
 * Copyright 2024 The Backstage Authors
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
 * shadcn/ui CSS custom property token system for Backstage.
 *
 * This module defines the TypeScript representation of the shadcn/ui token
 * vocabulary, concrete light and dark token value sets aligned with Backstage's
 * canonical palettes, and helper functions for programmatic token generation
 * and application.
 *
 * Token values are derived from:
 * - `packages/theme/src/base/palettes.ts` (Backstage palettes)
 * - `packages/ui/src/css/tokens.css` (BUI CSS custom property system)
 *
 * The companion CSS file `shadcn-tokens.css` in this directory defines the
 * same tokens as CSS custom properties for direct stylesheet consumption.
 *
 * @remarks
 * This module is side-effect-free — importing it does not modify the DOM.
 * All DOM manipulation (e.g. {@link applyShadcnTokens}) requires an explicit
 * function call.
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/**
 * Describes the complete shadcn/ui CSS custom property token vocabulary
 * used by Backstage's redesigned component library.
 *
 * Every field maps 1-to-1 to a `--<kebab-case>` CSS custom property in
 * the `shadcn-tokens.css` stylesheet. The camelCase TypeScript field name
 * is converted to the kebab-case CSS property name by the helper utilities
 * in this module (e.g. `cardForeground` → `--card-foreground`).
 *
 * @public
 */
export interface ShadcnTokens {
  // --- Core Color Tokens ---

  /** App-level background color (`--background`). */
  background: string;
  /** Primary text / foreground color (`--foreground`). */
  foreground: string;

  /** Card surface background (`--card`). */
  card: string;
  /** Text on card surfaces (`--card-foreground`). */
  cardForeground: string;

  /** Popover surface background (`--popover`). */
  popover: string;
  /** Text on popover surfaces (`--popover-foreground`). */
  popoverForeground: string;

  /** Primary brand / interactive color (`--primary`). */
  primary: string;
  /** Foreground on primary surfaces (`--primary-foreground`). */
  primaryForeground: string;

  /** Secondary surface color (`--secondary`). */
  secondary: string;
  /** Text on secondary surfaces (`--secondary-foreground`). */
  secondaryForeground: string;

  /** Muted surface color (`--muted`). */
  muted: string;
  /** Text on muted surfaces (`--muted-foreground`). */
  mutedForeground: string;

  /** Accent surface color (`--accent`). */
  accent: string;
  /** Text on accent surfaces (`--accent-foreground`). */
  accentForeground: string;

  /** Destructive / danger color (`--destructive`). */
  destructive: string;
  /** Text on destructive surfaces (`--destructive-foreground`). */
  destructiveForeground: string;

  /** Default border color (`--border`). */
  border: string;
  /** Input border / background color (`--input`). */
  input: string;
  /** Focus ring color (`--ring`). */
  ring: string;

  // --- Layout Tokens ---

  /** Default border radius (`--radius`). */
  radius: string;

  // --- Typography Tokens ---

  /** Sans-serif font stack (`--font-sans`). */
  fontSans: string;
  /** Monospace font stack (`--font-mono`). */
  fontMono: string;

  // --- Status Color Tokens ---

  /** Status OK color (`--status-ok`). */
  statusOk: string;
  /** Status warning color (`--status-warning`). */
  statusWarning: string;
  /** Status error color (`--status-error`). */
  statusError: string;
  /** Status running color (`--status-running`). */
  statusRunning: string;
  /** Status pending color (`--status-pending`). */
  statusPending: string;
  /** Status aborted color (`--status-aborted`). */
  statusAborted: string;

  // --- Navigation / Sidebar Tokens ---

  /** Sidebar background color (`--sidebar-background`). */
  sidebarBackground: string;
  /** Sidebar foreground / text color (`--sidebar-foreground`). */
  sidebarForeground: string;
  /** Sidebar active indicator color (`--sidebar-indicator`). */
  sidebarIndicator: string;
  /** Sidebar nav-item hover background (`--sidebar-nav-item-hover-background`). */
  sidebarNavItemHoverBackground: string;
}

/**
 * Theme mode discriminator for shadcn/ui token resolution.
 *
 * @public
 */
export type ShadcnThemeMode = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/**
 * Mapping from camelCase `ShadcnTokens` field names to their kebab-case
 * CSS custom property counterparts. This single source-of-truth drives
 * both {@link generateShadcnTokenCSS} and {@link applyShadcnTokens}.
 */
const TOKEN_CSS_PROPERTY_MAP: Readonly<Record<keyof ShadcnTokens, string>> = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  radius: '--radius',
  fontSans: '--font-sans',
  fontMono: '--font-mono',
  statusOk: '--status-ok',
  statusWarning: '--status-warning',
  statusError: '--status-error',
  statusRunning: '--status-running',
  statusPending: '--status-pending',
  statusAborted: '--status-aborted',
  sidebarBackground: '--sidebar-background',
  sidebarForeground: '--sidebar-foreground',
  sidebarIndicator: '--sidebar-indicator',
  sidebarNavItemHoverBackground: '--sidebar-nav-item-hover-background',
};

/**
 * Ordered list of token keys for deterministic iteration.
 * Using `Object.keys` on the frozen map preserves insertion order.
 */
const TOKEN_KEYS = Object.keys(
  TOKEN_CSS_PROPERTY_MAP,
) as (keyof ShadcnTokens)[];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Canonical identifier for the shadcn/ui CSS custom property token stylesheet.
 *
 * Consumers can use this constant as a module specifier when referencing the
 * stylesheet in build pipelines or CSS import statements.
 *
 * @example
 * ```ts
 * import { SHADCN_TOKENS_CSS } from '@backstage/theme';
 * // Value: '@backstage/theme/tokens/shadcn-tokens.css'
 * ```
 *
 * @public
 */
export const SHADCN_TOKENS_CSS: string =
  '@backstage/theme/tokens/shadcn-tokens.css';

// ---------------------------------------------------------------------------
// Token Value Sets
// ---------------------------------------------------------------------------

/**
 * Concrete token values for **light mode**.
 *
 * Values are derived from the canonical Backstage palette
 * (`palettes.light` in `packages/theme/src/base/palettes.ts`) and the BUI
 * CSS token system (`packages/ui/src/css/tokens.css`).
 *
 * All foreground / background pairings meet WCAG 2.1 AA contrast
 * requirements (≥ 4.5:1 for normal text, ≥ 3:1 for large text).
 *
 * @public
 */
export const lightTokenValues: ShadcnTokens = {
  // Core colors — derived from palettes.light
  background: '#F8F8F8', // palettes.light.background.default
  foreground: '#000000', // palettes.light.textContrast
  card: '#FFFFFF', // palettes.light.background.paper
  cardForeground: '#000000', // palettes.light.textContrast
  popover: '#FFFFFF', // BUI --bui-bg-popover (light)
  popoverForeground: '#000000', // palettes.light.textContrast
  primary: '#1F5493', // palettes.light.primary.main
  primaryForeground: '#FFFFFF', // BUI --bui-fg-solid (light)
  secondary: '#F8F8F8', // light neutral surface
  secondaryForeground: '#000000', // palettes.light.textContrast
  muted: '#F8F8F8', // subtle background
  mutedForeground: '#6E6E6E', // palettes.light.textSubtle
  accent: '#F8F8F8', // accent surface
  accentForeground: '#000000', // palettes.light.textContrast
  destructive: '#E22134', // palettes.light.status.error
  destructiveForeground: '#FFFFFF', // white on destructive

  // Borders and interactive
  border: '#E6E6E6', // palettes.light.border
  input: '#E6E6E6', // palettes.light.border
  ring: '#1F5493', // palettes.light.primary.main

  // Layout
  radius: '0.5rem', // BUI --bui-radius-3

  // Typography
  fontSans: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
  fontMono:
    "ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace",

  // Status colors — from palettes.light.status
  statusOk: '#1DB954', // palettes.light.status.ok
  statusWarning: '#FF9800', // palettes.light.status.warning
  statusError: '#E22134', // palettes.light.status.error
  statusRunning: '#1F5493', // palettes.light.status.running
  statusPending: '#FFED51', // palettes.light.status.pending
  statusAborted: '#757575', // palettes.light.status.aborted

  // Navigation / Sidebar — from palettes.light.navigation
  sidebarBackground: '#171717', // palettes.light.navigation.background
  sidebarForeground: '#b5b5b5', // palettes.light.navigation.color
  sidebarIndicator: '#9BF0E1', // palettes.light.navigation.indicator
  sidebarNavItemHoverBackground: '#404040', // palettes.light.navigation.navItem.hoverBackground
};

/**
 * Concrete token values for **dark mode**.
 *
 * Values are derived from the canonical Backstage palette
 * (`palettes.dark` in `packages/theme/src/base/palettes.ts`) and the BUI
 * dark-theme CSS tokens (`packages/ui/src/css/tokens.css`
 * `[data-theme-mode='dark']` block).
 *
 * All foreground / background pairings meet WCAG 2.1 AA contrast
 * requirements (≥ 4.5:1 for normal text, ≥ 3:1 for large text).
 *
 * @public
 */
export const darkTokenValues: ShadcnTokens = {
  // Core colors — derived from palettes.dark (Blitzy dark theme)
  background: '#0F0A1F', // palettes.dark.background.default
  foreground: '#E5DEFF', // palettes.dark.textContrast
  card: '#1a1a2e', // palettes.dark.background.paper
  cardForeground: '#E5DEFF', // palettes.dark.textContrast
  popover: '#1a1a2e', // BUI --bui-bg-popover (dark)
  popoverForeground: '#E5DEFF', // palettes.dark.textContrast
  primary: '#7A6DEC', // Blitzy purple
  primaryForeground: '#FFFFFF', // white on primary
  secondary: '#1a1a2e', // palettes.dark.background.paper
  secondaryForeground: '#E5DEFF', // palettes.dark.textContrast
  muted: '#1a1a2e', // dark muted surface
  mutedForeground: '#A29DBC', // palettes.dark.textSubtle
  accent: '#2D1C77', // Blitzy accent
  accentForeground: '#E5DEFF', // palettes.dark.textContrast
  destructive: '#C62828', // Darkened from palettes.dark.status.error for WCAG AA normal text contrast
  destructiveForeground: '#FFFFFF', // white on destructive — contrast ≈ 6.7:1

  // Borders and interactive
  border: '#E6E6E6', // palettes.dark.border
  input: '#E6E6E6', // palettes.dark.border
  ring: '#9CC9FF', // palettes.dark.primary.main

  // Layout
  radius: '0.5rem', // BUI --bui-radius-3

  // Typography — same stacks for both modes
  fontSans: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
  fontMono:
    "ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace",

  // Status colors — from palettes.dark.status
  statusOk: '#71CF88', // palettes.dark.status.ok
  statusWarning: '#FFB84D', // palettes.dark.status.warning
  statusError: '#F84C55', // palettes.dark.status.error
  statusRunning: '#3488E3', // palettes.dark.status.running
  statusPending: '#FEF071', // palettes.dark.status.pending
  statusAborted: '#9E9E9E', // palettes.dark.status.aborted

  // Navigation / Sidebar — from palettes.dark.navigation
  sidebarBackground: '#424242', // palettes.dark.navigation.background
  sidebarForeground: '#b5b5b5', // palettes.dark.navigation.color
  sidebarIndicator: '#9BF0E1', // palettes.dark.navigation.indicator
  sidebarNavItemHoverBackground: '#404040', // palettes.dark.navigation.navItem.hoverBackground
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Converts a {@link ShadcnTokens} object into a CSS custom property
 * declaration block string.
 *
 * The returned string is formatted as a series of CSS declarations
 * (without a wrapping selector) that can be embedded into a `<style>`
 * tag or concatenated with a selector to form a complete rule-set.
 *
 * @example
 * ```ts
 * import { generateShadcnTokenCSS, lightTokenValues } from '@backstage/theme';
 *
 * const css = `:root {\n  ${generateShadcnTokenCSS(lightTokenValues)}\n}`;
 * ```
 *
 * @param tokens - A complete {@link ShadcnTokens} value set.
 * @returns A multi-line string of `--property: value;` declarations
 *          separated by newlines and indented with two spaces.
 *
 * @public
 */
export function generateShadcnTokenCSS(tokens: ShadcnTokens): string {
  return TOKEN_KEYS.map(
    key => `${TOKEN_CSS_PROPERTY_MAP[key]}: ${tokens[key]};`,
  ).join('\n  ');
}

/**
 * Programmatically applies a set of {@link ShadcnTokens} values as inline
 * CSS custom properties on the given DOM element.
 *
 * When called without an explicit `element` argument the tokens are applied
 * to `document.documentElement` (the `<html>` element), which is the
 * conventional location for CSS custom property tokens.
 *
 * @remarks
 * This function intentionally performs direct DOM mutation via
 * `element.style.setProperty`. It is designed for imperative use in
 * theme-switching logic (e.g. inside a React effect) and is **not**
 * automatically invoked on module import — the module remains
 * side-effect-free.
 *
 * @example
 * ```tsx
 * import { applyShadcnTokens, darkTokenValues } from '@backstage/theme';
 *
 * // Inside a React effect or event handler:
 * applyShadcnTokens(darkTokenValues);
 * ```
 *
 * @param tokens  - A complete {@link ShadcnTokens} value set to apply.
 * @param element - The target DOM element. Defaults to `document.documentElement`.
 *
 * @public
 */
export function applyShadcnTokens(
  tokens: ShadcnTokens,
  element: HTMLElement = document.documentElement,
): void {
  for (const key of TOKEN_KEYS) {
    element.style.setProperty(TOKEN_CSS_PROPERTY_MAP[key], tokens[key]);
  }
}
