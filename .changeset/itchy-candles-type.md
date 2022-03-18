---
'@backstage/plugin-org': patch
---

Introduced a new MyGroups SidebarItem that links to one or more groups based on the logged in user's membership.

To use MyGroups you'll need to add it to your `Root.tsx` like this:

```diff
// app/src/components/Root/Root.tsx
+ import { MyGroups } from '@backstage/plugin-org';
+ import GroupIcon from '@material-ui/icons/People';

<SidebarPage>
    <Sidebar>
      //...
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        //...
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
+        <MyGroups
+          singularTitle="My Squad"
+          pluralTitle="My Squads"
+          icon={GroupIcon}
+        />
       //...
      </SidebarGroup>
    </ Sidebar>
</SidebarPage>
```
