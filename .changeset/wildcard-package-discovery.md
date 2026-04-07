---
'@backstage/backend-defaults': patch
'@backstage/frontend-defaults': patch
---

Added support for wildcard patterns using _ in `backend.packages.include` and `backend.packages.exclude` as well as
`app.packages.include` and `app.packages.exclude`.
For example, `@backstage/plugin-catalog-backend-module-_`will now match all packages starting with
that prefix, and`@backstage/plugin-_-backend-module-_` will match all module packages from all backend plugins. This
allows for more flexible and concise package discovery configurations, especially in cases where there are multiple
related packages that share a common naming pattern.
