---
'@backstage/config-loader': minor
---

TypeScript configuration schema errors are now reported as warnings while a best-effort schema is generated. Set `schemaErrorMode` to `'error'` to retain strict loading, and use `onSchemaError` to route warnings to a custom handler.
