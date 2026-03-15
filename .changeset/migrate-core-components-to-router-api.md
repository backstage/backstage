---
'@backstage/core-components': patch
---

Migrated routing imports from `react-router-dom` to `@backstage/frontend-plugin-api` and removed `react-router-dom` from peer dependencies. Cleaned up legacy React Router beta compatibility code in `Link.tsx`. Static routing functions like `resolvePath` and `matchRoutes` in `Items.tsx`, `SidebarSubmenuItem.tsx`, and `RoutedTabs.tsx` now use the `RouterApi` instance.
