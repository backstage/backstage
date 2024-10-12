---
'@backstage/backend-defaults': patch
---

Sensitive internal fields on `BackstageCredentials` objects are now defined as read-only properties in order to minimize risk of leakage.
