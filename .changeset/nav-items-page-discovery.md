---
'@backstage/plugin-app-react': minor
'@backstage/plugin-app': patch
---

Added new `NavItem`, `NavItems`, and `navItems` prop to `NavContentComponentProps` for auto-discovering navigation items from page extensions. The new `navItems` collection supports `take(id)` and `rest()` methods for placing specific items in custom sidebar positions. The existing `items` prop is now deprecated in favor of `navItems`.
