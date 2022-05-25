---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-ldap': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Add capability to refresh entity providers.

Entity providers can implement `getTaskId?(): string` in order to participate
in this feature.

Existing entity providers were enabled.

The refresh for providers can be triggered using the `/api/catalog/refresh` endpoint.

Example: _refresh all entity providers_

```
POST /api/catalog/refresh
{
  "providers": "all"
}
```

Example: _refresh selected entity providers_

```
POST /api/catalog/refresh
{
  "providers": ["providerName", "anotherProviderName"]
}
```

Non-existent or non-supporting (== no `getTaskId`) entity providers will be ignored.

**The permission plugin is not yet supported and all such requests will be rejected.**
