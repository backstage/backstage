---
'@backstage/plugin-mcp-actions-backend': patch
---

MCP requests that fail now respond with the status code of the underlying error, such as a `401` or `403` for authentication and authorization failures, or the status of a failed request to another backend, instead of a generic `500` internal server error. The response body is still a JSON-RPC error.
