---
'@backstage/plugin-mcp-actions-backend': patch
---

Added `scopes_supported` to the OAuth 2.0 Protected Resource Metadata (RFC 9728) response. Without this field, RFC-compliant MCP clients did not know which scope to request and never received a refresh token, causing sessions to expire with the short-lived access token. The field now includes `openid`, and also `offline_access` when `auth.experimentalRefreshToken` is enabled.
