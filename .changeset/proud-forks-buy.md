---
'@backstage/plugin-scaffolder': patch
---

The `ui:options` for `OwnedEntityPicker` field are now passed to `EntityPicker`. This allows you to use any `ui:options` which `EntityPicker` accepts in the `OwnedEntityPicker` field including `allowArbitraryValues` and `defaultNamespace`.
