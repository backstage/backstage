---
'@backstage/backend-app-api': minor
---

Service factories added by feature loaders now have lower priority and will be ignored if a factory for the same service is added directly by `backend.add(serviceFactory)`.
