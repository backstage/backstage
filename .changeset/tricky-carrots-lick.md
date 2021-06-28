---
'@backstage/plugin-catalog-backend': minor
---

Move `LdapOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
to `@backstage/plugin-catalog-backend-module-ldap`.

The `LdapOrgReaderProcessor` isn't registered by default anymore, if
you want to continue using it you have to register it manually at the catalog
builder:

1. Add dependency to `@backstage/plugin-catalog-backend-module-ldap` to the `package.json` of your backend.
2. Add the processor to the catalog builder:

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addProcessor(
  LdapOrgReaderProcessor.fromConfig(config, {
    logger,
  }),
);
```

For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-ldap` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-ldap/README.md).
