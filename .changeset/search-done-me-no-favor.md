---
'@backstage/plugin-search-backend-module-pg': minor
---

**BREAKING**

The `PgSearchEngine` implements the new stream-based indexing process expected
by the latest `@backstage/search-backend-node`.

When updating to this version, you must also update to the latest version of
`@backstage/search-backend-node`. Check [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
for further details.
