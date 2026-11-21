---
'@backstage/plugin-catalog-graph': patch
---

Added an `entityFilter` configuration option to the `entity-card:catalog-graph/relations` and `page:catalog-graph` extensions in the new frontend system. It takes an entity predicate query and hides entities in the graph that don't match it, for example to leave out deprecated entities:

```yaml
app:
  extensions:
    - entity-card:catalog-graph/relations:
        config:
          entityFilter:
            $any:
              - spec.lifecycle: { $exists: false }
              - $not:
                  spec.lifecycle: deprecated
```
