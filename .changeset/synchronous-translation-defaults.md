---
'@backstage/core-app-api': patch
'@backstage/frontend-test-utils': minor
'@backstage/test-utils': minor
---

The built-in translation API and translation test implementations now support `getDefaultMessage(selection)`, which synchronously returns the message declared by a translation ref without loading language resources or applying installed overrides.
