---
'@backstage/ui': minor
---

**BREAKING**: Removed the `toolbarWrapper` element from `PluginHeader` and dropped `toolbarWrapper` from `PluginHeaderDefinition.classNames`. Toolbar layout styles now live on `toolbar` (`.bui-PluginHeaderToolbar`).

**Migration:** Update custom CSS that targeted `.bui-PluginHeaderToolbarWrapper` to use `.bui-PluginHeaderToolbar` instead.

**Affected components:** PluginHeader
