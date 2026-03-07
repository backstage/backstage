# @backstage/theme

This package provides the unified theming system for Backstage, including both Material UI themes (for backward compatibility with community plugins) and a CSS custom property-based token system for shadcn/ui components styled with Tailwind CSS.

## CSS Custom Property Token System

The package exports CSS custom property definitions that power the shadcn/ui component redesign across Backstage's core packages. Tokens are defined for both light and dark modes, enabling seamless theme switching without JavaScript runtime overhead.

### Token Categories

**Color tokens:**

- `--background` / `--foreground` — Page background and primary text color
- `--primary` / `--primary-foreground` — Primary action and branding color
- `--secondary` / `--secondary-foreground` — Secondary accent color
- `--destructive` / `--destructive-foreground` — Danger and error states
- `--muted` / `--muted-foreground` — Subdued surfaces and secondary text
- `--accent` / `--accent-foreground` — Highlight and hover states
- `--popover` / `--popover-foreground` — Popover and dropdown surfaces
- `--card` / `--card-foreground` — Card surfaces
- `--border` — Border color
- `--input` — Input field border color
- `--ring` — Focus ring color

**Typography tokens:**

- `--font-sans` — Proportional font stack (system-ui) for prose and navigation
- `--font-mono` — Monospace font stack for identifiers, metadata values, and code content

**Radius tokens:**

- `--radius` — Base border radius for consistent rounded corners

### Theme Switching

Dark mode is activated via the `[data-theme-mode='dark']` selector on the document body. All token values are swapped at the root level, requiring no JavaScript re-renders for theme changes.

### BUI Token Alignment

The CSS custom property tokens are aligned with the existing Backstage UI (`packages/ui`) `--bui-*` token system. For example, `--background` maps from `--bui-bg-app`, `--primary` maps from `--bui-bg-solid`, and `--border` aligns with `palettes.light.border`.

### Accessibility

Both light and dark themes meet WCAG 2.1 AA contrast requirements for all text and interactive elements. Color-blind-friendly status indicators use shape and pattern differentiation alongside color.

## Architecture

```
src/
├── base/       — Base palettes, typography, and page theme definitions
│                 + CSS custom property token generators
├── unified/    — UnifiedThemeProvider that provides both MUI theme contexts
│                 AND injects CSS custom properties
├── tokens/     — shadcn/ui CSS custom property token definitions
│                 for light and dark modes
├── v4/         — Deprecated MUI v4 theme support
│                 (retained for backward compatibility)
└── v5/         — MUI v5 component themes
                  (retained for backward compatibility)
```

The `UnifiedThemeProvider` continues to supply Material UI v4 and v5 theme contexts so that community plugins rendering MUI components internally function without modification. Simultaneously, it injects CSS custom properties at the document root for shadcn/ui components.

## Installation

Install the package via Yarn:

```sh
cd <package-dir> # if within a monorepo
yarn add @backstage/theme
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
