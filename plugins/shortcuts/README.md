# shortcuts

`shortcuts-plugin` allows a user to have easy access to pages within a Backstage app by storing them as "shortcuts" in the Sidebar.

## Usage

Add the `<Shortcuts />` component within your `<Sidebar>`:

```ts
import { Shortcuts } from '@backstage/plugin-shortcuts';

<Sidebar>
  {/* ... */}
  <SidebarDivider />
  <Shortcuts />
  <SidebarSpace />
</Sidebar>;
```

The plugin exports a `shortcutApiRef` but the plugin includes a default implementation of the `ShortcutApi` that uses `localStorage` to store each users shortcuts.

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
