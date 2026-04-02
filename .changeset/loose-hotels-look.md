---
'@backstage/plugin-mcp-actions-backend': patch
---

Fix `/.well-known/oauth-protected-resource` endpoint for external deployments.

`getBaseUrl()` was returning internal container URLs unreachable by external MCP clients.
Switched to `getExternalBaseUrl()` so URLs resolve using `backend.baseUrl`.

Also fixed the `resource` field to include the `/v1` path suffix matching the Streamable HTTP
transport mount path, as required by RFC 9728. Without this, MCP clients that validate the
`resource` field (e.g. Claude Code) fail OAuth discovery with a URL mismatch error.
