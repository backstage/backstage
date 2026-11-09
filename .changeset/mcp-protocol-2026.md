---
'@backstage/plugin-mcp-actions-backend': patch
---

Added support for MCP revision `2026-07-28` on the existing Streamable HTTP endpoints while retaining support for older clients. The session duration metric now reports the negotiated protocol version when available. Proxies and browser CORS policies must allow the new MCP request headers.
