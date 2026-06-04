---
'@backstage/plugin-scaffolder-backend-module-mcp': minor
---

Introduce `@backstage/plugin-scaffolder-backend-module-mcp`, a scaffolder backend module that makes Backstage an MCP (Model Context Protocol) client. Adds an `mcp:call` action so templates can invoke tools on any MCP server declared under `scaffolder.mcpServers.*`. Supports the stdio transport, lazy connection reuse per server, per-call timeouts, and a graceful shutdown hook. Complements `@backstage/plugin-mcp-actions-backend`, which exposes Backstage as an MCP server.
