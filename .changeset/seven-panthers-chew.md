---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING** Due to the changes made in the Permission framework. The catalogs permission rules and the API of `createCatalogPermissionRule` have been changed to reflect the change from individual function parameters to a single object parameter and the addition of the `paramsSchema`.

As an example for the `hasLabel` rule. The API before the change was

```ts
hasLabel.apply(entity, 'backstage.io/testLabel');
hasLabel.toQuery('backstage.io/testLabel');
```

and the API after the change now is

```ts
hasLabel.apply(entity, {
  label: 'backstage.io/testLabel',
});

hasLabel.toQuery({
  label: 'backstage.io/testLabel',
});
```

This applies to all of the permission rules exported by the catalog backend.

- `hasAnnotation`
- `hasLabel`
- `hasMetadata`
- `hasSpec`
- `isEntityKind`
- `isEntityOwner`
