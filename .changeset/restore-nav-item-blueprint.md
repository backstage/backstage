---
'@backstage/frontend-plugin-api': patch
---

Restored the deprecated `NavItemBlueprint` export. While nav items are now automatically inferred from `PageBlueprint` extensions, removing the export was a breaking change for adopters with in-repo plugins that still reference it. The blueprint remains deprecated and will be removed in a future major version.
