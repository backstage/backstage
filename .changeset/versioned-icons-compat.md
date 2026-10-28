---
'@backstage/core-compat-api': patch
---

Updated app compatibility providers to use the current element-based icons API while preserving legacy app context component lookups.

The forwards compatibility provider supplies the `core.icons.v2` API. Older compiled consumers requesting `core.icons` must upgrade; the adapter for that original API ID is only provided by `@backstage/plugin-app` in new-system apps.
