---
'@backstage/plugin-mcp-actions-backend': patch
---

Validate each action against the MCP tool schema when responding to `tools/list`, and skip any action that doesn't conform instead of failing the entire response. A single misbehaving action with a malformed input schema will now be logged as a warning and omitted from the tool list, letting the remaining actions continue to be served.
