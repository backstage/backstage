---
'@backstage/plugin-catalog-backend': patch
---

CatalogBuilder supports now subscription to processing engine errors.

```ts
subscribe(options: {
  onProcessingError: (event: { unprocessedEntity: Entity, error: Error }) => Promise<void> | void;
});
```

If you want to get notified on errors while processing the entities, you call CatalogBuilder.subscribe
to get notifications with the parameters defined as above.
