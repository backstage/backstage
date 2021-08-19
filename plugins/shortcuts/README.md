# shortcuts

The shortcuts plugin allows a user to have easy access to pages within a Backstage app by storing them as "shortcuts" in the Sidebar.

## Usage

### Install the package:

```bash
yarn add @backstage/plugin-shortcuts
```

### Register plugin:

This plugin requires explicit registration, so you will need to add it to your App's `plugins.ts` file:

```ts
// ...
export { shortcutsPlugin } from '@backstage/plugin-shortcuts';
```

If you don't have a `plugins.ts` see: [troubleshoot](#troubleshoot)

### Add the `<Shortcuts />` component within your `<Sidebar>`:

```tsx
import { Sidebar, SidebarDivider, SidebarSpace } from '@backstage/core';
import { Shortcuts } from '@backstage/plugin-shortcuts';

export const SidebarComponent = () => (
  <Sidebar>
    {/* ... */}
    <SidebarDivider />
    <Shortcuts />
    <SidebarSpace />
  </Sidebar>
);
```

The plugin exports a `shortcutApiRef` but the plugin includes a default implementation of the `ShortcutApi` that uses `localStorage` to store each user's shortcuts.

To overwrite the default implementation add it to the App's `apis.ts`:

```ts
import { shortcutsApiRef } from '@backstage/plugin-shortcuts';
import { CustomShortcutsImpl } from '...';

export const apis = [
  // ...
  createApiFactory({
    api: shortcutsApiRef,
    deps: {},
    factory: () => new CustomShortcutsImpl(),
  }),
];
```

# Troubleshoot

If you don't have a `plugins.ts` you can create a new one on `packages/app/src/plugins.ts` and then add this lines to your `App.tsx` if there is other plugins that requires explicit registration:

```diff
+ import * as plugins from './plugins';

const app = createApp({
  apis,
+   plugins: Object.values(plugins),
  bindRoutes({ bind }) {
    /* ... */
  },
});
```

Or simply edit `App.tsx` with:

```diff
+ import { shortcutsPlugin } from '@backstage/plugin-shortcuts

const app = createApp({
  apis,
+   plugins: [shortcutsPlugin],
  bindRoutes({ bind }) {
    /* ... */
  },
});
```
