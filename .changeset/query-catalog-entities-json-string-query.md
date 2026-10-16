---
'@backstage/plugin-catalog-backend': patch
---

The `catalog:query-catalog-entities` action now accepts `query` when it is passed as a JSON string, parsing it into an object before validation. Previously the action failed with `Query must be an object` for clients that send object arguments as strings, which is common for MCP/LLM clients.
