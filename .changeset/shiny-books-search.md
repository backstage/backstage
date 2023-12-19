---
'@backstage/frontend-app-api': minor
---

The app no longer provides the `AppContext` from `@backstage/core-plugin-api`. Components that require this context to be available should use the `compatWrapper` helper from `@backstage/core-compat-api`.
