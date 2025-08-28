---
'@backstage/plugin-catalog-backend': patch
---

The 'get-catalog-entity' action now throws a ConflictError instead of generic Error if multiple entities are found, so MCP call doesn't fail with 500.
