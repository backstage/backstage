---
'@backstage/plugin-mcp-actions-backend': patch
---

Added support for splitting MCP actions into multiple per-plugin servers via `mcpActions.servers` configuration. Each server gets its own endpoint at `/api/mcp-actions/v1/{key}` with actions scoped by `pluginSources` and optional include/exclude filter rules. Also added `mcpActions.tools` for overriding tool descriptions globally. When `mcpActions.servers` is not configured, the plugin continues to serve a single server at `/api/mcp-actions/v1`.
