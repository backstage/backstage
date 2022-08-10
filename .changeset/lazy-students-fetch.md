---
'@backstage/backend-app-api': minor
'@backstage/backend-defaults': minor
---

Introduced a new `backend-defaults` package carrying `createBackend` which was previously exported from `backend-app-api`.
The `backend-app-api` package now exports the `createSpecializedBacked` that does not add any service factories by default.
