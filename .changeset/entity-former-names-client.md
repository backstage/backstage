---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-node': minor
'@backstage/plugin-catalog-react': minor
---

The catalog API and the catalog service gained an optional `getEntityByFormerRef` method that finds the entity currently declaring a given former entity ref. The in-memory catalog client and the catalog test mocks support the new method. Custom implementations of the catalog API do not need to implement it.
