---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog-node': minor
---

Introduced new `streamEntities` and `streamEntityPages` async generator methods for the catalog.

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

Additionally, a `streamEntityPages` method is available that streams entities in pages, allowing for batch processing of entities.
This method is more efficient than `streamEntities` when you can process entities in chunks.
Example usage:

```ts
const pageStream = catalogClient.streamEntityPages(
  { pageSize: 100 },
  { token },
);
for await (const page of pageStream) {
  // Handle page of entities
}
```
