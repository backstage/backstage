---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
to `@backstage/plugin-catalog-backend-module-msgraph`.

The `MicrosoftGraphOrgReaderProcessor` isn't registered by default anymore, if
you want to continue using it you have to register it manually at the catalog
builder:

1. Add dependency to `@backstage/plugin-catalog-backend-module-msgraph` to the `package.json` of your backend.
2. Add the processor to the catalog builder:

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addProcessor(
  MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
    logger,
  }),
);
```

For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-msgraph` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md).
