---
'@backstage/config-loader': patch
---

Added an `onSchemaError` callback that allows callers to report TypeScript configuration schema errors and continue loading. The callback receives a `ConfigSchemaError` containing the source package and underlying cause. Without a handler, schema errors are thrown.
