---
'@backstage/plugin-mcp-actions-backend': patch
---

Added a `toolNameSeparator` configuration option, allowing `_`, `-` or `__` to be used instead of `.` in namespaced MCP tool names, for MCP clients that don't accept dots in tool names.
