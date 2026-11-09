---
'@backstage/plugin-mcp-actions-backend': minor
---

Updated the MCP SDK to v2 and added support for MCP revision `2026-07-28` on the existing Streamable HTTP endpoints.

Existing clients are expected to continue working, but some older clients may no longer be supported. This is a minor release as a precaution. Test your MCP clients, including authentication, before upgrading.

Proxies and browser CORS policies must allow the new MCP request headers when using the new protocol revision. The session duration metric now reports the negotiated protocol version when available.
