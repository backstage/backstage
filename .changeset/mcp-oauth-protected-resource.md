---
'@backstage/plugin-mcp-actions-backend': patch
---

Added OAuth Protected Resource Metadata endpoint (`/.well-known/oauth-protected-resource`) per RFC 9728. This allows MCP clients to discover the authorization server for the resource.

Also enabled OAuth well-known endpoints when CIMD (Client ID Metadata Documents) is configured, not just when DCR is enabled.
