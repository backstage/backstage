---
'@backstage/plugin-mcp-actions-backend': patch
---

Added support for splitting MCP actions into multiple servers via `mcpActions.servers` configuration. Each server gets its own endpoint at `/api/mcp-actions/v1/{key}` with actions scoped using include/exclude filter rules. Tool names are now namespaced with the plugin ID by default, configurable via `mcpActions.namespacedToolNames`. When `mcpActions.servers` is not configured, the plugin continues to serve a single server at `/api/mcp-actions/v1`.
