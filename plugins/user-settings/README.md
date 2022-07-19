# user-settings

Welcome to the user-settings plugin!

_This plugin was created through the Backstage CLI_

## About the plugin

This plugin provides two components, `<UserSettings />` is intended to be used within the [`<Sidebar>`](https://backstage.io/storybook/?path=/story/sidebar--sample-sidebar) and displays the signed-in users profile picture and name.

The second component is a settings page where the user can control different settings across the App.

## Usage

Add the item to the Sidebar:

```ts
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';

<SidebarPage>
  <Sidebar>
    <SidebarSettings />
  </Sidebar>
</SidebarPage>;
```

Add the page to the App routing:

```ts
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';

const AppRoutes = () => (
  <Routes>
    <Route path="/settings" element={<SettingsRouter />} />
  </Routes>
);
```

### Props

**Auth Providers**

By default, the plugin provides a list of configured authentication providers fetched from `app-config.yaml` and displayed in the "Authentication Providers" tab.

If you want to supply your own custom list of Authentication Providers, use the `providerSettings` prop:

```ts
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

> **Note that the list of providers expects to be rendered within a MUI [`<List>`](https://material-ui.com/components/lists/)**

**Tabs**

By default, the plugin renders 3 tabs of settings; GENERAL, AUTHENTICATION PROVIDERS, and FEATURE FLAGS.

If you want to add more options for your users,
just pass the extra tabs using `UserSettingsTab` components as children of the `UserSettingsPage` route.
The path is in this case a child of the settings path,
in the example below it would be `/settings/advanced` so that you can easily link to it.

```tsx
import {
  UserSettingsPage,
  UserSettingsTab,
} from '@backstage/plugin-user-settings';

<Route path="/settings" element={<UserSettingsPage />}>
  <UserSettingsTab path="/advanced" title="Advanced">
    <AdvancedSettings />
  </UserSettingsTab>
</Route>;
```

To standardize the UI of all setting tabs,
make sure you use a similar component structure as the other tabs.
You can take a look at
[the example extra tab](https://github.com/backstage/backstage/blob/master/packages/app/src/components/advancedSettings/AdvancedSettings.tsx)
we have created in Backstage's demo app.
