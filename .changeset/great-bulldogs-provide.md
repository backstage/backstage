---
'@backstage/core-components': patch
---

The `Bar` component will now render a `MobileSidebar` instead of the current sidebar on smaller screens. The state of the `MobileSidebar` will be treated as always open.

---

**Add MobileSidebar:** A navigation component, which sticks to the bottom. If there is no content in the Sidebar, it won't be rendered. If there are `children ` in the `Sidebar`, but no `SidebarGroups` as `children`, it will render all `children` into a default overlay menu, which can be displayed by clicking a menu item. If `SidebarGroups` are provided, it will render them in the bottom navigation. Additionally, a `MobileSidebarContext`, which wraps the component, will save the selected menu item.

**Add SidebarGroup:** Groups items of the `Sidebar` together. On bigger screens, this won't have any effect at the moment. On smaller screens, it will render a given icon into the `MobileSidebar`. If a route is provided, clicking the `SidebarGroup` in the `MobileSidebar` will route to the page. If no route is provided, it will add a provided icon to the `MobileSidebar` as a menu item & will render the children into an overlay menu, which will be displayed when the menu item is clicked.
