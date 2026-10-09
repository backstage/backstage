---
'@backstage/catalog-client': patch
---

The in-memory Catalog client now evaluates query predicates against the same search rows as `filter` and the catalog backend, instead of against raw entity JSON. This fixes relation shorthand such as `relations.hasMember`, case-insensitive field keys, default namespaces, and array fields in `queryEntities`, `streamEntities`, `getEntitiesByRefs`, and `getEntityFacets`.
