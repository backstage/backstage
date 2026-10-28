---
'@backstage/plugin-app-react': minor
---

Removed deprecated blueprint and navigation parameters. Use `component` in the app root wrapper and router blueprints, and consume `navItems` in custom navigation components.

Use `navItems.rest()` instead of iterating over `items`. Replace `item.to` with `item.href` and `item.text` with `item.title`. The `item.icon` value is a React element, so render it directly instead of using it as a component type.
