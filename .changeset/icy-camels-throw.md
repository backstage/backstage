---
'@backstage/plugin-mcp-actions-backend': patch
---

The MCP backend will now convert known Backstage errors into textual responses with `isError: true`.
The error message can be useful for an LLM to understand and maybe give back to the user.
Previously all errors where thrown out to `@modelcontextprotocol/sdk` which causes a generic 500.
