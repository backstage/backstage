---
'@backstage/plugin-mcp-actions-backend': patch
---

Authentication and permission failures on the MCP endpoints now return `401` and `403` responses instead of `500`
