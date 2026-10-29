---
'@backstage/plugin-mcp-actions-backend': patch
---

The `tool-execution` audit event of a tool that returned an error now records the error sent to the client (for example `NotFoundError: Action "x" not found`) instead of the generic `Tool "x" reported isError=true`.
