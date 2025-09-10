---
'@backstage/plugin-catalog-react': patch
---

Removed the deprecation warning when not passing an explicit type to `EntityCardBlueprint`. Omitting the type is now intended, allowing the layout to pick the default type instead, typically `content`.
