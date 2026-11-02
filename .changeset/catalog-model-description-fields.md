---
'@backstage/plugin-catalog-backend': minor
---

The `get-catalog-model-description` action now describes the fields of each entity kind, including the relations that fields generate. The action also accepts an optional `query` predicate, using the same predicate syntax as the `query-catalog-entities` action, to narrow the output to specific kinds, fields, relations, annotations, labels, or tags.
