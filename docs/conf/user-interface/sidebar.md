---
id: sidebar
title: Customizing Your Sidebar
sidebar_label: Sidebar
description: Learn how to customize the look and feel of your Sidebar.
---

As you've seen there are many ways that you can customize your Backstage app. The following section will show you how you can customize the sidebar.

## Sidebar Sub-menu

For this example we'll show you how you can expand the sidebar with a sub-menu:

1. Open the `Root.tsx` file located in `packages/app/src/components/Root` as this is where the sidebar code lives
2. Then we want to add the following import for `useApp`:

   ```tsx title="packages/app/src/components/Root/Root.tsx"
   import { useApp } from '@backstage/core-plugin-api';
   ```

3. Then update the `@backstage/core-components` import like this:

   ```tsx title="packages/app/src/components/Root/Root.tsx"
   import {
     Sidebar,
     sidebarConfig,
     SidebarDivider,
     SidebarGroup,
     SidebarItem,
     SidebarPage,
     SidebarScrollWrapper,
     SidebarSpace,
     useSidebarOpenState,
     Link,
     /* highlight-add-start */
     GroupIcon,
     SidebarSubmenu,
     SidebarSubmenuItem,
     /* highlight-add-end */
   } from '@backstage/core-components';
   ```

4. Finally replace `<SidebarItem icon={HomeIcon} to="catalog" text="Home" />` with this:

   ```tsx title="packages/app/src/components/Root/Root.tsx"
   <SidebarItem icon={HomeIcon} to="catalog" text="Home">
     <SidebarSubmenu title="Catalog">
       <SidebarSubmenuItem
         title="Domains"
         to="catalog?filters[kind]=domain"
         icon={useApp().getSystemIcon('kind:domain')}
       />
       <SidebarSubmenuItem
         title="Systems"
         to="catalog?filters[kind]=system"
         icon={useApp().getSystemIcon('kind:system')}
       />
       <SidebarSubmenuItem
         title="Components"
         to="catalog?filters[kind]=component"
         icon={useApp().getSystemIcon('kind:component')}
       />
       <SidebarSubmenuItem
         title="APIs"
         to="catalog?filters[kind]=api"
         icon={useApp().getSystemIcon('kind:api')}
       />
       <SidebarDivider />
       <SidebarSubmenuItem
         title="Resources"
         to="catalog?filters[kind]=resource"
         icon={useApp().getSystemIcon('kind:resource')}
       />
       <SidebarDivider />
       <SidebarSubmenuItem
         title="Groups"
         to="catalog?filters[kind]=group"
         icon={useApp().getSystemIcon('kind:group')}
       />
       <SidebarSubmenuItem
         title="Users"
         to="catalog?filters[kind]=user"
         icon={useApp().getSystemIcon('kind:user')}
       />
     </SidebarSubmenu>
   </SidebarItem>
   ```

When you startup your Backstage app and hover over the Home option on the sidebar you'll now see a nice sub-menu appear with links to the various Kinds in your Catalog. It would look like this:

![Sidebar sub-menu example](./../../assets/getting-started/sidebar-submenu-example.png)

You can see more ways to use this in the [Storybook Sidebar examples](https://backstage.io/storybook/?path=/story/layout-sidebar--sample-scalable-sidebar)
