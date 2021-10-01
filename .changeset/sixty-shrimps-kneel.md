---
'@backstage/core-app-api': patch
---

Stop calling connector.removeSession in StaticAuthSessionManager, instead just discarding the
session locally.
