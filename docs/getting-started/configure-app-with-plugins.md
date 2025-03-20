---
id: configure-app-with-plugins
title: Configuring App with plugins
description: Documentation on How Configuring App with plugins
---

Audience: Developers

:::note Note
Backstage plugins are primarily written using [TypeScript](https://www.typescriptlang.org), [Node.js](https://nodejs.org) and [React](https://reactjs.org). Having an understanding of these technologies will be beneficial on your journey to customizing Backstage!
:::

## Summary

Backstage plugins customize the app for your needs. There is a
[plugin directory](https://backstage.io/plugins) with plugins for many common
infrastructure needs - CI/CD, monitoring, auditing, and more.

## Adding existing plugins to your app

The following steps assume that you have
[created a Backstage app](./index.md) and want to add an existing plugin
to it.

You can find many wonderful plugins out there for Backstage including the [Community Plugins Repository](https://github.com/backstage/community-plugins) and the [Backstage Plugin Directory](https://backstage.io/plugins).

Adding plugins to your Backstage app is generally a simple process, and ideally each plugin will come with its own documentation on how to install and configure it. The general steps usually include:

1. Add the plugin's npm package to the repo:

   ```bash title="From your Backstage root directory"
   yarn --cwd packages/app add @<scope>/<plugin-name>
   ```

   Note the plugin is added to the `app` package, rather than the root
   `package.json`. Backstage Apps are set up as monorepos with
   [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). Frontend UI Plugins are generally added to the `app` folder, while Backend Plugins are added to the `backend` folder. In the example above, the plugin is added to the `app` package assuming it is a frontend plugin.

2. Lets assume the frontend plugin we added contains a react component called `AwesomeCardContent` we can add to the `EntityPage` of our app, we could then import and use it as such:

   ```tsx title="packages/app/src/components/catalog/EntityPage.tsx"
   /* highlight-add-start */
   import { AwesomeCardContent } from '@<scope>/<plugin-name>';
   /* highlight-add-end */

   const overviewContent = (
     <Grid container spacing={3}>
       /* highlight-add-start */
       <Grid item md={6}>
         <AwesomeCardContent />
       </Grid>
       /* highlight-add-end */
     </Grid>
   );
   ```

   This is just one example, but each Backstage instance may integrate content or
   cards to suit their needs on different pages, tabs, etc. In addition, while some
   plugins such as this example are designed to annotate or support specific software
   catalog entities, others may be intended to be used in a stand-alone fashion and
   would be added outside the `EntityPage`, such as being added to the main navigation.

3. _[Optional]_ Add a proxy config:

   Plugins that collect data off of external services may require the use of a proxy service, to support this you can add the following settings to your `app-config.yaml` file:

   ```yaml title="app-config.yaml"
   proxy:
     '/<proxy-path>/api':
       target: https://<your-target-instance>.com
       headers:
         Authorization: ${YOUR_AUTH_TOKEN}
   ```

If you need more detailed instructions on how to use and setup the Backstage Proxy, you can find them [here](../plugins/proxying.md).

### Adding a plugin page to the Sidebar

In a standard Backstage app created with
[@backstage/create-app](./index.md), the sidebar is managed inside
`packages/app/src/components/Root/Root.tsx`. The file exports the entire
`Sidebar` element of your app, which you can extend with additional entries by
adding new `SidebarItem` elements.

For example, if you install the `api-docs` plugin, a matching `SidebarItem`
could be something like this:

```tsx title="packages/app/src/components/Root/Root.tsx"
// Import icon from Material UI
import ExtensionIcon from '@material-ui/icons/Extension';

// ... inside the AppSidebar component
<SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />;
```

You can also use your own SVGs directly as icon components. Just make sure they
are sized according to the Material UI's
[SvgIcon](https://material-ui.com/api/svg-icon/) default of 24x24px, and set the
extension to `.icon.svg`. For example:

```tsx
import InternalToolIcon from './internal-tool.icon.svg';
```

On mobile devices the `Sidebar` is displayed at the bottom of the screen. For
customizing the experience you can group `SidebarItems` in a `SidebarGroup`
(Example 1) or create a `SidebarGroup` with a link (Example 2). All
`SidebarGroup`s are displayed in the bottom navigation with an icon.

```tsx
// Example 1
<SidebarGroup icon={<MenuIcon />} label="Menu">
  ...
  <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
  ...
<SidebarGroup />
```

```tsx
// Example 2
<SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
  ...
  <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
  ...
<SidebarGroup />
```

If no `SidebarGroup` is provided a default menu will display the `Sidebar`
content.
