# bui-themer

## Description

The Backstage UI Themer helps you convert an existing MUI v5 theme into Backstage UI (BUI) CSS custom properties. It detects installed app themes, generates a complete set of BUI CSS variables for each theme (light and dark), and lets you preview how common BUI components look with your colors and typography. You can copy the generated CSS to the clipboard or download it as a `.css` file, and it works with both the old and new Backstage frontend systems without requiring any backend setup.

## Installation

### 1) Add the dependency to your app

Run this from your Backstage repo root:

```bash
yarn add --cwd packages/app @backstage/plugin-bui-themer
```

### 2) Wire it up depending on your frontend system

#### Old frontend system (legacy `App.tsx` with `<FlatRoutes>`)

Add a route for the page in your app:

```tsx
// packages/app/src/App.tsx
import React from 'react';
import { Route } from 'react-router-dom';
import { FlatRoutes } from '@backstage/core-app-api';
import { BuiThemerPage } from '@backstage/plugin-bui-themer';

export const App = () => (
  <FlatRoutes>
    {/* ...your other routes */}
    <Route path="/bui-themer" element={<BuiThemerPage />} />
  </FlatRoutes>
);
```

#### New frontend system

If package discovery is enabled in your app, this plugin is picked up automatically after installation — no code changes required. Just navigate to `/bui-themer`.

If you prefer explicit registration (or don't use discovery), register the plugin as a feature. The page route (`/bui-themer`) is provided by the plugin.

```tsx
// packages/app/src/App.tsx (or your app entry where you call createApp)
import React from 'react';
import { createApp } from '@backstage/frontend-defaults';
import buiThemerPlugin from '@backstage/plugin-bui-themer';

const app = createApp({
  features: [
    // ...other features
    buiThemerPlugin,
  ],
});

export default app.createRoot();
```

## Accessing the Themer page

- Navigate to `/bui-themer` in your Backstage app (for example `http://localhost:3000/bui-themer`).
- Optional: Add a sidebar/link in your app that points to `/bui-themer` if you want a permanent navigation entry.
