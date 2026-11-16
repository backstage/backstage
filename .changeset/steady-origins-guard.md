---
'@backstage/plugin-mcp-actions-backend': patch
---

The MCP endpoints now reject requests from unknown browser origins with `403 Forbidden`, as the MCP specification requires to prevent DNS rebinding attacks. A request that carries an `Origin` header is only accepted from the origin of `app.baseUrl` or `backend.baseUrl`. Requests without an `Origin` header, which CLI and IDE MCP clients send, are not affected. If you use a browser-based MCP client served from another origin, add it to `mcpActions.dnsRebindingProtection.allowedOrigins`. You can also set `mcpActions.dnsRebindingProtection.allowedHosts` to reject requests whose `Host` header isn't one of the listed host names.
