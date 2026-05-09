---
id: mui-to-bui
title: MUI to BUI Theme Migration
description: How to use the mui-to-bui plugin to migrate your MUI theme to Backstage UI (BUI) CSS custom properties
---

Backstage UI (BUI) is the new component library for Backstage, gradually replacing Material UI (MUI) components. The `@backstage/plugin-mui-to-bui` plugin provides an interactive tool to help you generate BUI CSS custom properties from your existing MUI theme.

## Overview

The plugin detects all installed themes in your Backstage app and generates a corresponding set of BUI CSS variables for each theme (supporting both light and dark variants). It lets you preview how BUI components look with your colors and typography, and then copy or download the generated CSS.

No backend setup is required, and the plugin works with both the old and new Backstage frontend systems.

## Installation

Add the package to your app:

```bash
yarn --cwd packages/app add @backstage/plugin-mui-to-bui
```

Once installed, the plugin is automatically discovered in the new frontend system. Navigate to `/mui-to-bui` in your running Backstage app to access the themer.

### Old Frontend System

If you are using the old frontend system, wire the plugin in manually:

```tsx
// packages/app/src/App.tsx
import { Route } from 'react-router-dom';
import { FlatRoutes } from '@backstage/core-app-api';
import { BuiThemerPage } from '@backstage/plugin-mui-to-bui';

export const App = () => (
  <FlatRoutes>
    {/* ...your other routes */}
    <Route path="/mui-to-bui" element={<BuiThemerPage />} />
  </FlatRoutes>
);
```

You can optionally add a link to `/mui-to-bui` in your sidebar for convenient access.

## Usage

1. Navigate to `/mui-to-bui` in your Backstage app.
2. Select a theme from the dropdown — all installed themes are detected automatically.
3. Choose between the **light** and **dark** variants.
4. Browse the generated BUI CSS custom properties and preview how components render.
5. Click **Copy CSS** to copy the variables to the clipboard, or **Download** to save them as a `.css` file.

## Applying the Generated CSS

Paste the downloaded CSS file into your app's stylesheet and import it in your entry point. For example:

```ts
// packages/app/src/index.tsx
import './bui-theme.css';
```

This registers the BUI CSS variables for your custom theme, ensuring that BUI components use your brand colors and typography.

## How It Works

The plugin reads your installed themes via the `appThemeApiRef` API and maps each MUI theme's color palette and typography settings to the corresponding BUI CSS custom property names (e.g. `--bui-color-primary` maps from `theme.palette.primary.main`). The mapping is best-effort — you may need to adjust a few variables manually if your theme uses unusual overrides.

## Related Resources

- [Backstage UI (BUI) Storybook](https://backstage.io/storybook) — browse BUI components and their available CSS custom properties
- [MUI to BUI migration analytics script](../../scripts/mui-to-bui/README.md) — a CLI tool that reports migration progress across the monorepo
