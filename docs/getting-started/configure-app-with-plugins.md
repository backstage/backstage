---
id: configure-app-with-plugins
title: Configuring App with plugins
description: Documentation on How Configuring App with plugins
---

## Adding existing plugins to your app

Coming soon!

### Adding a plugin page to the Sidebar

In a standard Backstage app created with
[@backstage/create-app](./create-an-app.md), the sidebar is managed inside
`packages/app/src/sidebar.tsx`. The file exports the entire `Sidebar` element of
your app, which you can extend with additional entries by adding new
`SidebarItem` elements.

For example, if you install the `api-docs` plugin, a matching `SidebarItem`
could be something like this:

```tsx
// Import icon from MUI
import ExtensionIcon from '@material-ui/icons/Extension';

// ... inside the AppSidebar component
<SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />;
```

You can also use your own SVGs directly as icon components. Just make sure they
are sized according to the Material UI's
[SvgIcon](https://material-ui.com/api/svg-icon/) default of 24x24px, and set the
extension to `.icon.svg`. For example:

```ts
import InternalToolIcon from './internal-tool.icon.svg';
```
