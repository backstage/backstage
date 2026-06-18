---
'@backstage/plugin-mcp-actions-backend': minor
---

MCP tool names are now sanitized so that they only contain alphanumeric characters and underscores. Any other characters, such as `.` and `-`, are replaced with underscores. For example, an action previously exposed as `catalog.get-catalog-entity` is now exposed as `catalog_get_catalog_entity`. This applies both with and without the plugin ID prefix configured via `mcpActions.namespacedToolNames`.
