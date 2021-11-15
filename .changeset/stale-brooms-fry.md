---
'@backstage/create-app': patch
---

You can now add `SidebarGroups` to the current `Sidebar`. This will not affect how the current sidebar is displayed, but allows a customization on how the `MobileSidebar` on smaler screens will look like. A `SidebarGroup` wil be displayed with the given icon in the `MobileSidebar`.

A `SidebarGroup` can either link to an existing page (e.g. `/search` or `/settings`) or wrap components, which will be displayed in a full screen overlay menu (e.g. `Menu`).

```diff
<Sidebar>
    <SidebarLogo />
+   <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
+   </SidebarGroup>
    <SidebarDivider />
+   <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        <SidebarDivider />
        <SidebarScrollWrapper>
            <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
        </SidebarScrollWrapper>
+   </SidebarGroup>
    <SidebarSpace />
    <SidebarDivider />
+   <SidebarGroup
+       label="Settings"
+       icon={<UserSettingsSignInAvatar />}
+       to="/settings"
+   >
        <SidebarSettings />
+   </SidebarGroup>
</Sidebar>
```

Additionally you can order the groups differently in the `MobileSidebar` than in the usual `Sidebar` simply by giving a group a priority. The groups will be displayed in a descending order from left to right.

```diff
<SidebarGroup
    label="Settings"
    icon={<UserSettingsSignInAvatar />}
    to="/settings"
+   priority={1}
>
    <SidebarSettings />
</SidebarGroup>
```

If you decide against adding `SidebarGroups` to your `Sidebar` the `MobileSidebar` will contain one default menu item, which will open a full screen overlay menu displaying all of the content of the current `Sidebar`.

More information on the `SidebarGroup` & the `MobileSidebar` component can be found in the changeset for the `core-components`.
