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
