---
'@backstage/plugin-techdocs-react': patch
---

TechDocs addons in the new frontend system now use a Utility API pattern instead of multiple attachment points. The `AddonBlueprint` now uses this new approach, and while addons created with older versions still work, they will produce a deprecation warning and will stop working in a future release.

As part of this change, the `techDocsAddonDataRef` alpha export was removed.
