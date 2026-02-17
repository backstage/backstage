---
'@backstage/plugin-app-react': minor
'@backstage/plugin-app': patch
---

Added new `NavContentNavItem`, `NavContentNavItems`, and `navItems` prop to `NavContentComponentProps` for auto-discovering navigation items from page extensions. The new `navItems` collection supports `take(id)` and `rest()` methods for placing specific items in custom sidebar positions, as well as `withComponent(Component)` which returns a `NavContentNavItemsWithComponent` for rendering items directly as elements. The existing `items` prop is now deprecated in favor of `navItems`.
