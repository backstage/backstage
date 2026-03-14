---
'@backstage/backend-defaults': patch
---

Added support for wildcard patterns using `*` in the `backend.packages.include` and `backend.packages.exclude`
configuration lists. For example, `@backstage/plugin-catalog-backend-module-*` will now match all packages starting with
that prefix, and `@backstage/plugin-*-backend-module-*` will match all module packages from all backend plugins. This
allows for more flexible and concise package discovery configurations, especially in cases where there are multiple
related packages that share a common naming pattern.
