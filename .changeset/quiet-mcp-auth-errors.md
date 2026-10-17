---
'@backstage/plugin-mcp-actions-backend': patch
---

MCP requests that fail authentication or authorization now respond with a `401` or `403` status, respectively, instead of a generic `500` internal server error. The response body is still a JSON-RPC error.
