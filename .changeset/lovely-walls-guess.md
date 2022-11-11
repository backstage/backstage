---
'@backstage/create-app': patch
---

Added `SidebarSubmenu` for all Kinds making it easier to discover them in the Catalog.

To add this to an existing Backstage instance you will need to make the following to your `packages/app/src/components/Root/Root.tsx`:

1. First add the following imports:

   ```ts
   import ApiIcon from '@material-ui/icons/Extension';
   import ComponentIcon from '@material-ui/icons/Memory';
   import DomainIcon from '@material-ui/icons/Apartment';
   import ResourceIcon from '@material-ui/icons/Work';
   import SystemIcon from '@material-ui/icons/Category';
   import UserIcon from '@material-ui/icons/Person';
   ```

2. Then update the `@backstage/core-components` import like this:

   ```diff
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
   +   GroupIcon,
   +   SidebarSubmenu,
   +   SidebarSubmenuItem,
     } from '@backstage/core-components';
   ```

3. Finally replace `<SidebarItem icon={HomeIcon} to="catalog" text="Home" />` with this:

   ```ts
   <SidebarItem icon={HomeIcon} to="catalog" text="Home">
     <SidebarSubmenu title="Catalog">
       <SidebarSubmenuItem
         title="Domains"
         to="catalog?filters[kind]=domain"
         icon={DomainIcon}
       />
       <SidebarSubmenuItem
         title="Systems"
         to="catalog?filters[kind]=system"
         icon={SystemIcon}
       />
       <SidebarSubmenuItem
         title="Components"
         to="catalog?filters[kind]=component"
         icon={ComponentIcon}
       />
       <SidebarSubmenuItem
         title="APIs"
         to="catalog?filters[kind]=api"
         icon={ApiIcon}
       />
       <SidebarDivider />
       <SidebarSubmenuItem
         title="Resources"
         to="catalog?filters[kind]=resource"
         icon={ResourceIcon}
       />
       <SidebarDivider />
       <SidebarSubmenuItem
         title="Groups"
         to="catalog?filters[kind]=group"
         icon={GroupIcon}
       />
       <SidebarSubmenuItem
         title="Users"
         to="catalog?filters[kind]=user"
         icon={UserIcon}
       />
     </SidebarSubmenu>
   </SidebarItem>
   ```
