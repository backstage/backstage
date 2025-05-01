---
'@backstage/plugin-catalog-react': patch
---

A new `filter` param has been added to the EntityContextMenuItemBlueprint to make it easier to determine if a menu item should appear for a given entity. The `filter` param is a function which accepts an entity and returns a boolean.
