---
id: migrate-to-shadcn-ui
title: Migrating from Material UI to shadcn/ui
description: Guide for migrating Backstage plugins and components from Material UI (v4/v5) to shadcn/ui (Radix UI primitives + Tailwind CSS)
---

:::tip

Backstage's core UI packages have completed the migration from Material UI to **shadcn/ui** — a design system built on [Radix UI](https://www.radix-ui.com/) primitives and styled with [Tailwind CSS](https://tailwindcss.com/). This migration was the outcome of the design system evaluation described in ["RFC: New design system for Backstage"](https://github.com/backstage/backstage/issues/27726). All core packages and in-scope plugins have been migrated in a single atomic transformation. Community plugins that render MUI internally continue to function without modification.

:::

## Introduction

Backstage's core UI packages (`@backstage/core-components`, `@backstage/theme`, and all first-party plugins) have been migrated from Material UI (v4/v5) to **shadcn/ui**. shadcn/ui is built on accessible, unstyled [Radix UI](https://www.radix-ui.com/) primitives and styled with [Tailwind CSS](https://tailwindcss.com/) utility classes.

Unlike traditional component libraries installed via npm, shadcn/ui operates as a **code-distribution system** — components are copied directly into the project source tree at `packages/core-components/src/components/ui/` and become first-party code. This approach eliminates external UI library version coupling and enables Backstage-specific customization at the source level.

### Key Changes

- **Component library:** MUI v4 (`@material-ui/core`) → shadcn/ui (Radix UI + Tailwind CSS)
- **Styling system:** `makeStyles` / `withStyles` CSS-in-JS → Tailwind CSS utility classes with `cn()` helper
- **Icons:** `@material-ui/icons` → `lucide-react`
- **Data tables:** `@material-table/core` → `@tanstack/react-table` + shadcn `DataTable`
- **Theming:** MUI `createTheme()` / `ThemeProvider` → CSS custom properties with `[data-theme-mode]` selectors
- **Toasts:** MUI `Snackbar` → Sonner toast
- **Command palette:** Custom search modal → `cmdk`-based command dialog (`Cmd/Ctrl+K`)

### Backward Compatibility

Community plugins that render MUI internally **continue to function without modification**. The `UnifiedThemeProvider` in `@backstage/theme` still injects MUI v4 and v5 theme contexts alongside the new CSS custom property tokens, ensuring visual coexistence between shadcn/ui core surfaces and MUI plugin surfaces.

---

## Import Transformations

This section provides before/after code examples for each major import transformation pattern.

### MUI Core Components → shadcn/ui

MUI layout primitives like `Box` and `Grid` are replaced with native HTML elements styled by Tailwind utility classes. MUI components like `Button`, `Dialog`, and `Tabs` are replaced with their shadcn/ui equivalents imported from `@/components/ui/*`.

```diff ts
- import { Button, Typography, Grid } from '@material-ui/core';
+ import { Button } from '@/components/ui/button';
  // Typography → use Tailwind utility classes directly:
  //   <p className="text-lg font-semibold text-foreground">...</p>
  // Grid → use Tailwind grid utilities directly:
  //   <div className="grid grid-cols-3 gap-4">...</div>
```

### MUI Styling → Tailwind CSS

All `makeStyles` and `withStyles` CSS-in-JS patterns are replaced with Tailwind CSS utility classes applied via `className`. The `cn()` helper function (built on `clsx` + `tailwind-merge`) is used for conditional class composition.

```diff ts
- import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
+ import { cn } from '../../lib/utils';

- const useStyles = makeStyles((theme: Theme) =>
-   createStyles({
-     root: {
-       padding: theme.spacing(2),
-       backgroundColor: theme.palette.background.paper,
-       borderRadius: theme.shape.borderRadius,
-     },
-     active: {
-       fontWeight: theme.typography.fontWeightBold,
-     },
-   }),
- );

  // Replace with Tailwind utility classes:
- const classes = useStyles();
- <div className={`${classes.root} ${isActive ? classes.active : ''}`}>
+ <div className={cn(
+   'p-2 bg-card rounded-md',
+   isActive && 'font-bold'
+ )}>
```

### MUI Icons → Lucide React

All 104 unique `@material-ui/icons` imports are replaced with tree-shakeable [Lucide React](https://lucide.dev/) icons. Icon names follow a similar convention but use PascalCase without the `Icon` suffix.

```diff ts
- import HomeIcon from '@material-ui/icons/Home';
- import SearchIcon from '@material-ui/icons/Search';
- import SettingsIcon from '@material-ui/icons/Settings';
+ import { Home, Search, Settings } from 'lucide-react';

  // Usage:
- <HomeIcon fontSize="small" />
+ <Home className="h-4 w-4" />
```

### Material Table → TanStack React Table

The `@material-table/core` package is replaced with the headless `@tanstack/react-table` library combined with the shadcn `DataTable` presentation component. This reduces the bundle size by over 90% while providing full sorting, filtering, pagination, and column visibility support.

```diff ts
- import MaterialTable from '@material-table/core';
+ import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
+ import { DataTable } from '@/components/ui/data-table';
```

### RJSF Material UI → RJSF Core

The `@rjsf/material-ui` theme is replaced with `@rjsf/core` using a custom shadcn/ui widget set for JSON Schema-driven forms in the scaffolder.

```diff ts
- import MaterialUITheme from '@rjsf/material-ui';
+ import Form from '@rjsf/core';
  // Use custom shadcn/ui widget theme for form field rendering
```

---

## Theming System Changes

The theming system has transitioned from MUI's JavaScript-based `createTheme()` / `ThemeProvider` pattern to a **CSS custom property token system**. All color, spacing, radius, and typography tokens are defined as CSS custom properties at the `:root` level. Theme switching (light/dark) is achieved by swapping token values using the `[data-theme-mode='dark']` selector — requiring zero JavaScript runtime for theme application.

### Token Architecture

Tokens are defined in `packages/core-components/src/styles/globals.css` and follow the shadcn/ui convention:

```css
:root {
  --background: #f8f8f8;
  --foreground: #000000;
  --primary: #1f5493;
  --primary-foreground: #ffffff;
  --card: #ffffff;
  --card-foreground: #000000;
  --border: #d5d5d5;
  --ring: #1f5493;
  --radius: 0.5rem;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono',
    'Courier New', monospace;
  /* ... additional tokens */
}

[data-theme-mode='dark'] {
  --background: #333333;
  --foreground: #ffffff;
  --primary: #9cc9ff;
  --primary-foreground: #101821;
  --card: #3d3d3d;
  --card-foreground: #ffffff;
  --border: #434343;
  /* ... dark mode overrides */
}
```

### The `cn()` Utility

The `cn()` helper function is located at `packages/core-components/src/lib/utils.ts` and combines `clsx` (conditional class logic) with `tailwind-merge` (deduplication of conflicting Tailwind classes):

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Use `cn()` whenever you need to conditionally compose Tailwind classes:

```tsx
<div className={cn(
  'flex items-center gap-2 rounded-md border p-4',
  isError && 'border-destructive bg-destructive/10',
  className
)}>
```

### UnifiedThemeProvider Integration

The `UnifiedThemeProvider` in `@backstage/theme` now injects CSS custom properties alongside the MUI v4 and v5 theme contexts. This dual injection ensures that:

- **Core components** read tokens from CSS custom properties (zero runtime overhead)
- **Community MUI plugins** continue reading from the MUI `ThemeProvider` context

No changes are required to `createApp()` or theme configuration for existing adopters — the `UnifiedThemeProvider` handles the bridging automatically.

---

## Dependency Changes

### Dependencies Removed (from in-scope packages)

| Package                   | Version        | Removed From                                                                                 |
| ------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `@material-ui/core`       | ^4.12.2        | `core-components`, `app`, `app-defaults`, all in-scope plugins                               |
| `@material-ui/icons`      | ^4.9.1         | `core-components`, `app`, `app-defaults`, all in-scope plugins                               |
| `@material-ui/lab`        | 4.0.0-alpha.61 | `core-components`, `catalog`, `scaffolder`, `search-react`, `user-settings`, `catalog-react` |
| `@material-ui/styles`     | ^4.11.5        | `techdocs`                                                                                   |
| `@material-table/core`    | ^0.2.41        | `core-components`                                                                            |
| `@rjsf/material-ui`       | 5.24.13        | `scaffolder`, `scaffolder-react`                                                             |
| `material-ui-popup-state` | ^5.0.0         | `catalog-react`                                                                              |

### Dependencies Added

| Package                 | Version  | Purpose                                                                 |
| ----------------------- | -------- | ----------------------------------------------------------------------- |
| `radix-ui`              | ^1.4.3   | Unified Radix UI primitives — accessible, unstyled component foundation |
| `tailwindcss`           | ^4.2.0   | Utility-first CSS framework — replaces all `makeStyles` / CSS-in-JS     |
| `lucide-react`          | ^0.575.0 | Tree-shakeable icon library — replaces `@material-ui/icons`             |
| `@tanstack/react-table` | ^8.21.3  | Headless table state management — replaces `@material-table/core`       |
| `cmdk`                  | ^1.1.1   | Command palette component — powers global search (`Cmd/Ctrl+K`)         |
| `sonner`                | ^2.0.7   | Toast notifications — replaces MUI `Snackbar` / `SnackbarContent`       |
| `clsx`                  | ^2.1.1   | Conditional `className` string utility                                  |
| `tailwind-merge`        | ^3.0.2   | Tailwind CSS class merging — prevents conflicting utility classes       |

---

## Backward Compatibility

Backward compatibility with community plugins that use MUI internally is a core requirement of this migration. The following mechanisms ensure that existing MUI-based plugins continue to work without modification:

### MUI Theme Contexts Are Preserved

MUI (`@mui/material` v5 and `@material-ui/core` v4) is **retained** in `packages/theme` specifically to support community plugins. The `UnifiedThemeProvider` continues to provide both MUI v4 and MUI v5 theme contexts so any plugin that reads from `useTheme()` or accesses `theme.palette`, `theme.spacing`, etc. will receive valid theme values.

### CSS Isolation

Tailwind CSS's `@layer` directive and Preflight CSS reset are **scoped** to prevent style bleeding into MUI-rendered plugin content. Core shadcn/ui surfaces use Tailwind's cascade layers (`@layer base`, `@layer components`, `@layer utilities`), which do not override MUI's Emotion-generated class selectors within plugin boundaries.

### Plugin Mounting API Is Unchanged

The plugin mounting API is entirely unaffected by this migration:

- `createPlugin()`
- `createRoutableExtension()`
- `createComponentExtension()`
- The entire `@backstage/frontend-plugin-api` surface

Plugins register and mount exactly as before. Only the visual rendering of **core** surfaces has changed.

### Overridable Components

The `overridableComponents` pattern used in `@backstage/core-components` and first-party plugins preserves its public contract. The underlying implementations now use shadcn/ui, but the override mechanism continues to work through CSS custom properties. Plugin consumers can customize visual tokens by overriding CSS custom properties at the appropriate scope.

---

## Plugin Migration Steps

To migrate a plugin from Material UI to shadcn/ui, follow these steps:

### Step 1: Replace Component Imports

Replace `@material-ui/core` component imports with shadcn/ui equivalents from `@/components/ui/*`:

```diff ts
- import Button from '@material-ui/core/Button';
- import Dialog from '@material-ui/core/Dialog';
- import Card from '@material-ui/core/Card';
+ import { Button } from '@/components/ui/button';
+ import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
+ import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
```

### Step 2: Replace CSS-in-JS with Tailwind

Replace all `makeStyles` / `withStyles` CSS-in-JS patterns with Tailwind utility classes. Use the `cn()` helper for conditional class composition:

```diff ts
- import { makeStyles } from '@material-ui/core/styles';
+ import { cn } from '@backstage/core-components/lib/utils';

- const useStyles = makeStyles({
-   container: { display: 'flex', gap: '8px', padding: '16px' },
-   highlight: { backgroundColor: '#e3f2fd' },
- });
  // ...
- const classes = useStyles();
- <div className={`${classes.container} ${isHighlighted ? classes.highlight : ''}`}>
+ <div className={cn('flex gap-2 p-4', isHighlighted && 'bg-primary/10')}>
```

### Step 3: Replace Icons

Replace `@material-ui/icons/*` imports with `lucide-react` equivalents:

```diff ts
- import AddIcon from '@material-ui/icons/Add';
- import DeleteIcon from '@material-ui/icons/Delete';
- import EditIcon from '@material-ui/icons/Edit';
+ import { Plus, Trash2, Pencil } from 'lucide-react';
```

Icon sizing is controlled via Tailwind classes instead of MUI's `fontSize` prop:

```diff tsx
- <AddIcon fontSize="small" />
+ <Plus className="h-4 w-4" />
```

### Step 4: Replace Data Tables

Replace `@material-table/core` usage with `@tanstack/react-table` for state management and the shadcn `DataTable` component for rendering:

```diff ts
- import MaterialTable from '@material-table/core';
+ import {
+   useReactTable,
+   getCoreRowModel,
+   getSortedRowModel,
+   getFilteredRowModel,
+   getPaginationRowModel,
+ } from '@tanstack/react-table';
+ import { DataTable } from '@/components/ui/data-table';
```

### Step 5: Update `package.json`

Remove MUI dependencies and add the shadcn/ui stack:

```diff json
  "dependencies": {
-   "@material-ui/core": "^4.12.2",
-   "@material-ui/icons": "^4.9.1",
-   "@material-ui/lab": "4.0.0-alpha.61",
+   "radix-ui": "^1.4.3",
+   "lucide-react": "^0.575.0",
+   "clsx": "^2.1.1",
+   "tailwind-merge": "^3.0.2"
  }
```

### Step 6: Update Tests

Update test files to match new component rendering. Import paths change, but **functional behavior is preserved** — the same user interactions and assertions should work with minimal adaptation:

```diff ts
- import { within } from '@testing-library/react';
  // Assertions may need to target new DOM structures:
  // - MUI `role="button"` → shadcn `<button>` elements
  // - MUI class selectors → Tailwind class or data-attribute selectors
  // - MUI `data-testid` attributes are preserved where they existed
```

---

## Component Mapping Reference

The following table maps commonly used MUI components to their shadcn/ui equivalents. For a complete mapping of all 88 MUI core component imports and 104 icon imports, see the architecture documentation.

| MUI Component                                    | shadcn/ui Equivalent      | Import Path                     | Notes                                                             |
| ------------------------------------------------ | ------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `Box`                                            | Native `div` + Tailwind   | —                               | `className="flex items-center p-4"`                               |
| `Grid`                                           | CSS Grid via Tailwind     | —                               | `className="grid grid-cols-3 gap-4"`                              |
| `Button`                                         | `Button`                  | `@/components/ui/button`        | 6 variants: default, destructive, outline, secondary, ghost, link |
| `IconButton`                                     | `Button`                  | `@/components/ui/button`        | `variant="ghost" size="icon"`                                     |
| `Dialog`                                         | `Dialog`                  | `@/components/ui/dialog`        | Built on Radix Dialog primitive                                   |
| `Drawer`                                         | `Sheet`                   | `@/components/ui/sheet`         | Side panel with `side` prop                                       |
| `Snackbar`                                       | Sonner toast              | `sonner`                        | `toast()` function call                                           |
| `Tabs` / `Tab`                                   | `Tabs`                    | `@/components/ui/tabs`          | Built on Radix Tabs primitive                                     |
| `Table` / `TableBody` / `TableRow` / `TableCell` | `Table`                   | `@/components/ui/table`         | Pure HTML table with Tailwind styling                             |
| `@material-table/core`                           | `DataTable`               | `@/components/ui/data-table`    | Built on `@tanstack/react-table`                                  |
| `Chip`                                           | `Badge`                   | `@/components/ui/badge`         | Variant support for status colors                                 |
| `Avatar`                                         | `Avatar`                  | `@/components/ui/avatar`        | Radix Avatar with image + fallback                                |
| `Accordion`                                      | `Accordion`               | `@/components/ui/accordion`     | Built on Radix Accordion primitive                                |
| `Select` / `MenuItem`                            | `Select`                  | `@/components/ui/select`        | Built on Radix Select with keyboard nav                           |
| `Tooltip`                                        | `Tooltip`                 | `@/components/ui/tooltip`       | Built on Radix Tooltip with collision detection                   |
| `Popover`                                        | `Popover`                 | `@/components/ui/popover`       | Built on Radix Popover with portal support                        |
| `Breadcrumbs`                                    | `Breadcrumb`              | `@/components/ui/breadcrumb`    | Composable BreadcrumbItem/Link/Separator                          |
| `LinearProgress`                                 | `Progress`                | `@/components/ui/progress`      | Radix Progress with accessible value                              |
| `Card` / `CardHeader` / `CardContent`            | `Card`                    | `@/components/ui/card`          | Card/CardHeader/CardTitle/CardContent/CardFooter                  |
| `TextField`                                      | `Input`                   | `@/components/ui/input`         | Tailwind-styled input field                                       |
| `Checkbox`                                       | `Checkbox`                | `@/components/ui/checkbox`      | Radix Checkbox with indicator                                     |
| `MenuList` / `MenuItem`                          | `DropdownMenu`            | `@/components/ui/dropdown-menu` | Radix DropdownMenu with keyboard navigation                       |
| `makeStyles` / `withStyles`                      | `cn()` + Tailwind classes | `lib/utils`                     | Zero runtime, no CSS-in-JS overhead                               |
| `useTheme`                                       | CSS custom properties     | —                               | `var(--primary)`, `var(--background)`, etc.                       |
| `SvgIcon`                                        | Lucide icons              | `lucide-react`                  | Tree-shakeable, consistent icon set                               |

---

## Legacy: MUI v4 → v5 Migration (Deprecated) {#legacy-mui-v4-to-v5}

:::caution

The following section documents the **previous** MUI v4 → v5 migration path. This guidance is retained for backward reference only. The recommended migration target is now **shadcn/ui** as documented above. If you are starting a new migration, follow the shadcn/ui migration steps instead.

:::

Backstage supports developing new plugins or components using Material UI v5. At the same time, large parts of the application as well as existing plugins will still be using Material UI v4. To support Material UI v4 and v5 at the same time, we have introduced a new concept called the `UnifiedTheme`. The goal of the `UnifiedTheme` is to allow gradual migration by running both versions in parallel, applying theme options similarly & supporting potential future versions of Material UI.

By default, the `UnifiedThemeProvider` is already used. If you add a custom theme in your `createApp` function, you would need to replace the Material UI `ThemeProvider` with the `UnifiedThemeProvider`:

```diff ts
+ import import {
+   UnifiedThemeProvider,
+   themes as builtinThemes,
+ } from '@backstage/theme';

  const app = createApp({
    // ...
    themes: [
      {
        // ...
        Provider: ({ children }) => (
-         <ThemeProvider theme={lightTheme}>.
-           <CssBaseline>{children}</CssBaseline>.
-         </ThemeProvider
+         <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
        ),
      }
    ]
  });
```

Before making specific changes to your Backstage instance, it might be helpful to take a look at the [Migration Guide provided by Material UI](https://mui.com/material-ui/migration/migration-v4/) first. It breaks down the differences between v4 and v5, and will make it easier to understand the impact on your Backstage instance & plugins.

It is worth noting that we are still using `@mui/styles` & `jss`. You may stumble upon documentation for migrating to `emotion` when using `makeStyles` or `withStyles`. It is not necessary to switch to `emotion`.

Important to keep in mind is that Material UI v5 is meant to be used with React Version 17 or higher. This means if you intend to use the Material UI v5 components in your plugins, you have to enforce React Version to be at least 17 for these plugins:

```json
...
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0",
    "react-router-dom": "6.0.0-beta.0 || ^6.3.0"
  },
...
```

To comply with Material UI recommendations, we are enforcing a new linting rule that favors standard imports over named imports and also restricts 3rd-level imports as they are considered private ([Guide: Minimizing Bundle Size](https://mui.com/material-ui/guides/minimizing-bundle-size)).

There are `core-components` as well as components exported from Backstage `*-react` plugins written in Material UI v4, which expect Material UI components as props. In these cases you will still be forced to use Material UI v4.

For current known issues with the Material UI v5 migration, follow our [Milestone on GitHub](https://github.com/backstage/backstage/milestone/40). Please open a new issue if you run into different problems.

### Legacy Plugin Migration Steps (MUI v4 → v5)

To migrate your plugin to Material UI v5, you can build on the resources available.

1. Manually fix the imports from named to default imports to match the new [linting rules for minimizing bundle size](https://mui.com/material-ui/guides/minimizing-bundle-size). Note: you can use the [new `@backstage/no-top-level-material-ui-4-imports` ESLint](https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-top-level-material-ui-4-imports.md) rule to help with this.
2. Run the migration `codemod` for the path of the specific plugin: `npx @mui/codemod v5.0.0/preset-safe plugins/<path>`.
3. Take a look at possible `TODO:` items the `codemod` could not fix.
4. Remove types & methods from `@backstage/theme` which are marked as `@deprecated`.
5. Ensure you are using `"react": "^17.0.0"` (or newer) as a peer dependency

You can follow the [migration of the GraphiQL plugin](https://github.com/backstage/backstage/pull/17696) as an example of a plugin migration.
