---
'@backstage/plugin-catalog-backend-module-github': patch
---

Fix GitHub `repository` event support.

`$.repository.organization` is only provided for `push` events. Switched to `$.organization.login` instead.
