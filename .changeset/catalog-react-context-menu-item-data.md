---
'@backstage/plugin-catalog-react': minor
---

`EntityContextMenuItemBlueprint` now accepts a static parameter shape
(`{ icon, title, href?, onClick?, disabled?, filter? }`) in addition to the
existing hook-based `useProps` form. Static params yield a new
`entityContextMenuItemDataRef` (typed as `EntityContextMenuItemData`) so
the consumer page can render the same item with either Material UI or
Backstage UI primitives. The hook-based form continues to yield a Material
UI menu item via `coreExtensionData.reactElement`, and both outputs are
optional so an extension can opt into either path.
