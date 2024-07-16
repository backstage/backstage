---
'@backstage/backend-app-api': minor
---

**BREAKING**: Removed the ability to pass callback-form service factories through the `defaultServiceFactories` option of `createSpecializedBackend`. This is an immediate breaking change as usage of this function is expected to be very rare.
