---
'@backstage/plugin-catalog-backend': minor
---

Added a new `refresh-catalog-entity` action to the catalog backend's `ActionsRegistryService`. The action triggers a refresh of a single entity identified by `kind` / `namespace` / `name` (kind defaults to `Component`, namespace defaults to `default`). It performs an existence check via `getEntityByRef` first and throws `NotFoundError` for missing entities. Exposed automatically as an MCP tool by `@backstage/plugin-mcp-actions-backend`.
