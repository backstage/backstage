---
'@backstage/plugin-org': patch
---

Introduced a new MyGroupsSidebarItem SidebarItem that links to one or more groups based on the logged in user's membership.

To use MyGroupsSidebarItem you'll need to add it to your `Root.tsx` like this:

```diff
// app/src/components/Root/Root.tsx
+ import { MyGroupsSidebarItem } from '@backstage/plugin-org';
+ import GroupIcon from '@material-ui/icons/People';

<SidebarPage>
    <Sidebar>
      //...
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        //...
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
+       <MyGroupsSidebarItem
+         singularTitle="My Squad"
+         pluralTitle="My Squads"
+         icon={GroupIcon}
+       />
       //...
      </SidebarGroup>
    </ Sidebar>
</SidebarPage>
```
