---
'@backstage/plugin-app-react': minor
---

Removed the deprecated flat `items` prop from custom navigation components. Use the `navItems` collection instead.

Use `navItems.rest()` instead of iterating over `items`. Replace `item.to` with `item.href` and `item.text` with `item.title`. The `item.icon` value is a React element, so render it directly instead of using it as a component type.
