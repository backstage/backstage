---
'@backstage/catalog-model': minor
---

Added `spec.type: 'mcp-server'` as a structured subtype of the `API` kind under `v1alpha1`/`v1beta1`. MCP server entities carry a `spec.remotes` list instead of a string `definition`, for representing Model Context Protocol servers in the catalog. See RFC [#32062](https://github.com/backstage/backstage/issues/32062). New public exports: `McpServerApiEntity`, `McpServerRemote`, `mcpServerApiEntityValidator`, and `isMcpServerApiEntity`. Also adds `addKindVersion` to `CatalogModelLayerBuilder` (alpha) so layers can add new versions or spec types to existing kinds.
