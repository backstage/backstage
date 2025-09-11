---
'@backstage/plugin-catalog-backend': minor
---

Add support for specifying an entity `spec.type` in `catalog.rules` and `catalog.locations.rules` within the catalog configuration.

For example, this enables allowing all `Template` entities with the type `website`:

```diff
  catalog:
    rules:
      - allow:
          - Component
          - API
          - Resource
          - System
          - Domain
          - Location
+     - allow:
+         - kind: Template
+           spec.type: website
        locations:
          - type: url
            pattern: https://github.com/org/*\/blob/master/*.yaml
```
