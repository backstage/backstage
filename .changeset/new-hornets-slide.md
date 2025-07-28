---
'@backstage/plugin-mcp-actions-backend': patch
---

Fixing error propagation from `actionsRegistry` so that the tool call is successful but it uses the `isError` property on the RPC message.
