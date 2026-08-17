---
'@backstage/plugin-mcp-actions-backend': patch
---

Added audit logging for MCP server operations using the Backstage Auditor Service. The plugin now emits `connection`, `tool-discovery`, and `tool-execution` audit events, allowing adopters to monitor and audit MCP server activity.
