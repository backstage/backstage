---
'@backstage/plugin-search-backend': patch
---

The `AuthorizedSearchEngine` will now ignore the deprecated `token` option, and treat it as an unauthorized request. This will not have any effect in practice, since credentials are always provided by the router.
