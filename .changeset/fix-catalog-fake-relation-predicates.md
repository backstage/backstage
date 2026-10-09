---
'@backstage/catalog-client': patch
---

The `InMemoryCatalogClient` test utility now matches entities the same way as the catalog backend. Both `filter` and `query` are evaluated against the same search rows that the backend builds for its search table, instead of `query` being evaluated against raw entity JSON. This affects `getEntities`, `getEntitiesByRefs`, `queryEntities`, `streamEntities`, and `getEntityFacets`.

This fixes several cases where the fake returned different results than a real catalog, which may change the outcome of existing tests:

- Relation shorthand such as `{ 'relations.hasMember': 'user:default/alice' }` now works in `query`, including with `$in`, `$hasPrefix`, `$exists`, `$contains`, and logical operators.
- Field keys are matched case-insensitively in both `filter` and `query`. For example, `{ 'spec.dependsOn': ... }` previously never matched in `filter`, and `{ 'METADATA.NAME': ... }` never matched in `query`.
- Entities without a `metadata.namespace` now match `{ 'metadata.namespace': 'default' }` in `query`.
- Values longer than 200 characters can no longer be matched by value, but still satisfy `$exists: true`, as in the backend.
- `metadata.name`, `metadata.namespace`, and `metadata.uid` always satisfy `$exists: true`, even when the entity has no value for them.
- Unsupported predicates are rejected with the same `InputError`s as the backend, for example an object `$contains` on any field other than `relations`.
- Entities that have keys differing only in casing, such as `spec.foo` and `spec.Foo`, now cause an `InputError` when matched, since the backend refuses to store such entities.
