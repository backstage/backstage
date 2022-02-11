---
'@backstage/catalog-client': minor
---

**BREAKING**: Removed the explicit `DiscoveryApi` and `FetchApi` export symbols,
which were unnecessary duplicates from the well known core ones.

The `CATALOG_FILTER_EXISTS` symbol's value has changed. However, this should not
affect any code in practice.
