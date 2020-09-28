# user-settings

Welcome to the user-settings plugin!

_This plugin was created through the Backstage CLI_

## About the plugin

This plugin is intended to be used within the [`<Sidebar>`](https://backstage.io/storybook/?path=/story/sidebar--sample-sidebar). It provides an item to the sidebar that will render an Avatar of the current signed in user, and when clicked display a settings UI where the user can control different settings across the App.

## Usage

Add the component to the sidebar:

```ts
import { UserSettings } from '@backstage/plugin-user-settings';

<SidebarPage>
  <Sidebar>
    <UserSettings />
  </Sidebar>
</SidebarPage>;
```

### Props

**Auth Providers**

By default, the plugin provides a list of configured authentication providers is fetched from `app-config.yaml` and displayed in the "Auth Providers" tab.

If you want to supply your own custom list of Authentication Providers, use the `providerSettings` prop:

```ts
const MyAuthProviders = () => (
  <ListItem>
    <ListItemText primary="example" />
    <ListItemSecondaryAction={someAction}>
  </ListItem>
);

<UserSettings providerSettings={<MyAuthProviders />} />
```

> **Note that the list of providers expects to be rendered within a MUI [`<List>`](https://material-ui.com/components/lists/)**
