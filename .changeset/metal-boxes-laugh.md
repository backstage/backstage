---
'@backstage/core-plugin-api': patch
---

The `useApp` and `useRouteRef` functions are now forwards compatible with the new frontend system. Along with the previous route reference changes this means that there is no longer a need to use `compatWrapper` from `@backstage/core-compat-api` to make code based on `@backstage/core-plugin-api` compatible with `@backstage/frontend-plugin-api` APIs.
