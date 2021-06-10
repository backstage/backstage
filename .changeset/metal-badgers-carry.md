---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
to `@backstage/plugin-catalog-backend-module-msgraph`.

For now `MicrosoftGraphOrgReaderProcessor` is only deprecated in
`@backstage/plugin-catalog-backend`, but will be removed in the future. While it
is now registered by default, it has to be registered manually in the future.
