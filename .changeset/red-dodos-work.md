---
'@backstage/plugin-catalog-backend': patch
---

Added new `catalog:validate-entity` action to actions registry.

This action can be used to validate entities against the software catalog.
This is useful for validating `catalog-info.yaml` file changes locally using the
Backstage MCP server.
