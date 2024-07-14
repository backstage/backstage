---
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
'@backstage/backend-app-api': patch
---

The `ServiceFactoryTest.get` method was deprecated and the `ServiceFactoryTest.getSubject` should be used instead. The `getSubject` method has the same behavior, but has a better method name to indicate that the service instance returned is the subject currently being tested.
