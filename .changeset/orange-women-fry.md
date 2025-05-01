---
'@backstage/plugin-catalog-react': patch
---

A new `filter` parameter has been added to `EntityContextMenuItemBlueprint` to make it easier to configure which entities a menu item should appear for. The `filter` parameter is a function which accepts an entity and returns a boolean.
