---
'@backstage/config-loader': patch
---

Added an `onSchemaError` callback that allows callers to report TypeScript configuration schema errors and continue loading. Without a handler, schema errors are thrown.
