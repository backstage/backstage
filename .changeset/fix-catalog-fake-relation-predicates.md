---
'@backstage/catalog-client': patch
---

Fixed relation shorthand query predicates such as `relations.hasMember` and `relations.parentOf` in the in-memory Catalog client. Relation predicates now work with value and logical operators across entity queries, streamed pagination, reference lookups, and facet queries.
