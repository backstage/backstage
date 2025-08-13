---
'@backstage/catalog-client': patch
'@backstage/plugin-catalog-backend': patch
---

Allow using negated filter in filter query.

This allows users to filter entities that do not match a specific column in the search table by
adding a `!` suffix to the column name in the filter query.

For example, you can use the following filter to find all entities that do not have a specific name:

```ts
const response = await catalogClient.getEntities(
  {
    filter: {
      'metadata.name!': 'excluded-name',
    },
  },
  { token },
);
```

This also works in the scaffolder entity pickers and other components that use the filter query.
