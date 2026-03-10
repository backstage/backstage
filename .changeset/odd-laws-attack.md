---
'@backstage/ui': patch
---

Merged the internal `PluginHeaderToolbar` component into `PluginHeader`, removing the separate component and its associated types (`PluginHeaderToolbarOwnProps`, `PluginHeaderToolbarProps`) and definition (`PluginHeaderToolbarDefinition`). This is an internal refactor with no changes to the public API of `PluginHeader`.

**Affected components:** PluginHeader
