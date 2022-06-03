---
'@backstage/plugin-org': patch
---

Added the ability to use an additional `filter` when fetching groups in `MyGroupsSidebarItem` component. Example:

```diff
// app/src/components/Root/Root.tsx
<SidebarPage>
    <Sidebar>
      //...
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        //...
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        <MyGroupsSidebarItem
          singularTitle="My Squad"
          pluralTitle="My Squads"
          icon={GroupIcon}
+         filter={{ 'spec.type': 'team' }}
        />
       //...
      </SidebarGroup>
    </ Sidebar>
</SidebarPage>
```
