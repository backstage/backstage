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
        - id: 'catalog:*'
          attributes:
            destructive: false
        - id: 'scaffolder:*'
      exclude:
        - id: '*:delete-*'
        - attributes:
            readOnly: false
```

Filtering logic:

- `include`: Rules for actions to include. Each rule can specify an `id` glob pattern and/or `attributes` constraints. An action must match at least one rule to be included. If no include rules are specified, all actions are included by default.
- `exclude`: Rules for actions to exclude. Takes precedence over include rules.
- Each rule combines `id` and `attributes` with AND logic (both must match if specified).
