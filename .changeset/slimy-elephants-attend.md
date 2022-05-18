---
'@backstage/plugin-catalog-backend': minor
---

Allow array as non-spread arguments at the `CatalogBuilder`.

```typescript
builder.addEntityProvider(...getArrayOfProviders());
```

can be simplified to

```typescript
builder.addEntityProvider(getArrayOfProviders());
```
