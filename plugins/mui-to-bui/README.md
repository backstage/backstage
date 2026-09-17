# mui-to-bui

## Description

The Backstage UI Themer helps you convert an existing MUI v5 theme into Backstage UI (BUI) CSS custom properties. It detects installed app themes, generates a complete set of BUI CSS variables for each theme (light and dark), and lets you preview how common BUI components look with your colors and typography. You can copy the generated CSS to the clipboard or download it as a `.css` file, and it works with both the old and new Backstage frontend systems without requiring any backend setup.

## Installation

Add the dependency to your app:

```bash
yarn --cwd packages/app add @backstage/plugin-mui-to-bui
```

Once installed, the plugin is automatically available in your app through the default feature discovery. For more details and alternative installation methods, see [installing plugins](https://backstage.io/docs/frontend-system/building-apps/installing-plugins).

## Accessing the Themer page

- Navigate to `/mui-to-bui` in your Backstage app (for example `http://localhost:3000/mui-to-bui`).
- Optional: Add a sidebar/link in your app that points to `/mui-to-bui` if you want a permanent navigation entry.

## Old Frontend System

If your Backstage app uses the old frontend system, you need to manually wire the
plugin into your app as outlined in this section. If you are on the new frontend
system, you can skip this.

Add a route for the page in your app:

```tsx
// packages/app/src/App.tsx
import React from 'react';
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
