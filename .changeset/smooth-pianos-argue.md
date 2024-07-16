---
'@backstage/backend-test-utils': patch
---

Updated `startTestBackend` and `ServiceFactoryTester` to only accept plain service factory or backend feature objects, no longer supporting the callback form. This lines up with the changes to `@backstage/backend-plugin-api` and should not require any code changes.
