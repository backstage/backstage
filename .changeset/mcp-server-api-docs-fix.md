---
'@backstage/plugin-api-docs': patch
---

Handle optional `definition` field on API entities following the addition of the `mcp-server` API type. The definition card now renders an empty state instead of nothing when no definition is present.
