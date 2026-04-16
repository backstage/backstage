---
'@backstage/backend-app-api': patch
---

Simplified the internal `ServiceRegistry.get` method by extracting a shared dependency resolution helper and reducing promise chain nesting.
