---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog-node': minor
---

Introduced new `streamEntities` async generator method for the catalog.

Catalog API and Catalog Service now includes a `streamEntities` method that allows for streaming entities from the catalog.
This method is designed to handle large datasets efficiently by processing entities in a stream rather than loading them
all into memory at once. This is useful when you need to fetch a large number of entities but do not want to use pagination
or fetch all entities at once.

Example usage:

```ts
const stream = catalogClient.streamEntities({}, { token });
for await (const entity of stream) {
  // Handle entity
}
```
