---
'@backstage/plugin-permission-node': patch
---

Added support for Standard Schema-compatible permission rule parameter schemas through `params.schema`. Schemas must support JSON Schema conversion. The Zod v3-specific `paramsSchema` option is now deprecated and remains available for compatibility.
