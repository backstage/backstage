---
'@backstage/frontend-plugin-api': patch
'@backstage/core-plugin-api': patch
---

Changed `useApiHolder` to return an empty `ApiHolder` instead of throwing when used outside of an API context.
