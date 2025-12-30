---
'@backstage/backend-defaults': minor
---

Added action filtering support with glob patterns and attribute constraints.

The `ActionsService` now supports filtering actions based on configuration. This allows controlling which actions are exposed to consumers like the MCP backend.

Configuration example:

```yaml
backend:
  actions:
    pluginSources:
      - catalog
      - scaffolder
    filter:
      include:
        - 'catalog:*'
      exclude:
        - '*:delete-*'
      attributes:
        destructive: false
```

Filtering logic:

- `include`: Glob patterns for action IDs to include (default: `['*']`)
- `exclude`: Glob patterns for action IDs to exclude (takes precedence over include)
- `attributes`: Attribute constraints that all must match (destructive, readOnly, idempotent)
