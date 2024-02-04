---
id: configure-app-with-plugins
title: Configuring App with plugins
description: Documentation on How Configuring App with plugins
---

Backstage plugins customize the app for your needs. There is a
[plugin directory](https://backstage.io/plugins) with plugins for many common
infrastructure needs - CI/CD, monitoring, auditing, and more.

## Adding existing plugins to your app

The following steps assume that you have
[created a Backstage app](./create-an-app.md) and want to add an existing plugin
to it.

We are using the
[CircleCI](https://github.com/CircleCI-Public/backstage-plugin/tree/main/plugins/circleci)
plugin in this example, which is designed to show CI/CD pipeline information attached
to an entity in the software catalog.

1. Add the plugin's npm package to the repo:

   ```bash
   # From your Backstage root directory
   yarn --cwd packages/app add @circleci/backstage-plugin
   ```

   Note the plugin is added to the `app` package, rather than the root
   `package.json`. Backstage Apps are set up as monorepos with
   [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). Since
   CircleCI is a frontend UI plugin, it goes in `app` rather than `backend`.

2. Add the `EntityCircleCIContent` extension to the entity pages in the app:

   ```tsx title="packages/app/src/components/catalog/EntityPage.tsx"
   /* highlight-add-start */
   import {
     EntityCircleCIContent,
     isCircleCIAvailable,
   } from '@circleci/backstage-plugin';
   /* highlight-add-end */

   const cicdContent = (
     <EntitySwitch>
       {/* ... */}
       {/* highlight-add-next-line */}
       <EntitySwitch.Case if={isCircleCIAvailable}>
         <EntityCircleCIContent />
       </EntitySwitch.Case>
       ;{/* highlight-add-end */}
     </EntitySwitch>
   );
   ```

   This is just one example, but each Backstage instance may integrate content or
   cards to suit their needs on different pages, tabs, etc. In addition, while some
   plugins such as this example are designed to annotate or support specific software
   catalog entities, others may be intended to be used in a stand-alone fashion and
   would be added outside the `EntityPage`, such as being added to the main navigation.

3. _[Optional]_ Add a proxy config:

   Plugins that collect data off of external services may require the use of a proxy service.
   This plugin accesses the CircleCI REST API, and thus requires a proxy definition.

   ```yaml title="app-config.yaml"
   proxy:
     '/circleci/api':
       target: https://circleci.com/api/v1.1
       headers:
         Circle-Token: ${CIRCLECI_AUTH_TOKEN}
   ```

### Adding a plugin page to the Sidebar

In a standard Backstage app created with
[@backstage/create-app](./create-an-app.md), the sidebar is managed inside
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
