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

The plugin exports a `shortcutApiRef` and an implementation of the `ShortcutApi` that uses `localStorage` for storage, that you can use to get started quickly. To use it add it to your app's `apis.ts`:

```ts
import {
  LocalStoredShortcuts,
  shortcutsApiRef,
} from '@backstage/plugin-shortcuts';

export const apis = [
  // ...
  createApiFactory({
    api: shortcutsApiRef,
    deps: { errorApi: errorApiRef },
    factory: ({ errorApi }) =>
      new LocalStoredShortcuts(
        WebStorage.create({ namespace: '@backstage/shortcuts', errorApi }),
      ),
  }),
];
```
