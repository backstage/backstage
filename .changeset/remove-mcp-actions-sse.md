---
'@backstage/plugin-mcp-actions-backend': minor
---

**BREAKING**: Removed the deprecated Server-Sent Events (SSE) MCP transport. MCP clients must use the Streamable HTTP endpoint at `/api/mcp-actions/v1` or a configured named-server endpoint.
