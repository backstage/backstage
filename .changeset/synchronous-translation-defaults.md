---
'@backstage/core-app-api': patch
'@backstage/frontend-test-utils': minor
'@backstage/test-utils': minor
---

The built-in translation API and translation test implementations now support `getDefaultMessage(selection, options?)`, which synchronously formats the message declared by a translation ref with optional typed replacement values, nested messages, and plural counts without loading language resources or applying installed overrides.
