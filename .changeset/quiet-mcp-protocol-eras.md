---
'@backstage/plugin-mcp-actions-backend': minor
---

Moved to version 2 of the MCP TypeScript SDK. The MCP server now also serves clients that use the `2026-07-28` protocol version. Existing clients are expected to continue working, but some older clients may no longer be supported. This is a minor release as a precaution. Test your MCP clients, including authentication, before upgrading.

The `mcp.protocol.version` attribute of the `mcp.server.session.duration` metric now holds the value of the `MCP-Protocol-Version` request header, when the server supports that version. Requests without this header, such as the `initialize` request of a `2025-*` client, no longer have the attribute. Before, the attribute always held the latest protocol version of the SDK.
