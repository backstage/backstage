---
'@backstage/plugin-catalog-graph': patch
---

Preserve graph options and increment `maxDepth` by 1.

The change will preserve options used at the `CatalogGraphCard`
(displayed at the entity page) and additionally, increments the
`maxDepth` option by 1 to increase the scope slightly compared to
the graph already seen by the users.

The default for `maxDepth` at `CatalogGraphCard` is 1.
