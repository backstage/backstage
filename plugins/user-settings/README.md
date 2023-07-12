# user-settings

Welcome to the user-settings plugin!

## About the plugin

This plugin provides two components, `<UserSettings />` is intended to be used within the [`<Sidebar>`](https://backstage.io/storybook/?path=/story/sidebar--sample-sidebar) and displays the signed-in users profile picture and name. The second component is a settings page where the user can control different settings across the App.

It also provides a `UserSettingsStorage` implementation of the `StorageApi`, to
be used in the frontend as a persistent alternative to the builtin `WebStorage`.
Please see [the backend
README](https://github.com/backstage/backstage/tree/master/plugins/user-settings-backend)
for installation instructions.

## Components Usage

Add the item to the Sidebar:

```tsx
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';

<SidebarPage>
  <Sidebar>
    <SidebarSettings />
  </Sidebar>
</SidebarPage>;
```

Add the page to the App routing:

```tsx
import { UserSettingsPage } from '@backstage/plugin-user-settings';

const AppRoutes = () => (
  <Routes>
    <Route path="/settings" element={<UserSettingsPage />} />
  </Routes>
);
```

### Props

**Auth Providers**

By default, the plugin provides a list of configured authentication providers fetched from `app-config.yaml` and displayed in the "Authentication Providers" tab.

If you want to supply your own custom list of Authentication Providers, use the `providerSettings` prop:

```tsx
const MyAuthProviders = () => (
  <ListItem>
    <ListItemText primary="example" />
    <ListItemSecondaryAction>{someAction}</ListItemSecondaryAction>
  </ListItem>
);

const AppRoutes = () => (
  <Routes>
    <Route
      path="/settings"
      element={<SettingsRouter providerSettings={<MyAuthProviders />} />}
    />
  </Routes>
);
```

> **Note that the list of providers expects to be rendered within a Material UI [`<List>`](https://v4.mui.com/components/lists/)**

**Tabs**

By default, the plugin renders 3 tabs of settings; GENERAL, AUTHENTICATION PROVIDERS, and FEATURE FLAGS.

If you want to add more options for your users,
just pass the extra tabs using `SettingsLayout.Route` components as children of the `UserSettingsPage` route.
The path is in this case a child of the settings path,
in the example below it would be `/settings/advanced` so that you can easily link to it.

```tsx
import {
  SettingsLayout,
  UserSettingsPage,
} from '@backstage/plugin-user-settings';

<Route path="/settings" element={<UserSettingsPage />}>
  <SettingsLayout.Route path="/advanced" title="Advanced">
    <AdvancedSettings />
  </SettingsLayout.Route>
</Route>;
```

To standardize the UI of all setting tabs,
make sure you use a similar component structure as the other tabs.
You can take a look at
[the example extra tab](https://github.com/backstage/backstage/blob/master/packages/app/src/components/advancedSettings/AdvancedSettings.tsx)
we have created in Backstage's demo app.

To change the layout altogether, create a custom page in `packages/app/src/components/user-settings/SettingsPage.tsx`:

```tsx
import React from 'react';
import {
  SettingsLayout,
  UserSettingsGeneral,
} from '@backstage/plugin-user-settings';
import { AdvancedSettings } from './advancedSettings';

export const settingsPage = (
  <SettingsLayout>
    <SettingsLayout.Route path="general" title="General">
      <UserSettingsGeneral />
    </SettingsLayout.Route>
    <SettingsLayout.Route path="advanced" title="Advanced">
      <AdvancedSettings />
    </SettingsLayout.Route>
  </SettingsLayout>
);
```

Now register the new settings page in `packages/app/src/App.tsx`:

```diff
+ import {settingsPage} from './components/settings/settingsPage';

const routes = (
  <FlatRoutes>
-    <Route path="/settings" element={<UserSettingsPage />} />
+    <Route path="/settings" element={<UserSettingsPage />}>
+      {settingsPage}
+    </Route>
  </FlatRoutes>
);
```
