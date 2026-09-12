---
'@backstage/backend-plugin-api': minor
---

**BREAKING PRODUCERS**: Added an instance ID to the root instance metadata service. Custom implementations and mocks must now provide a globally unique ID that remains stable for the lifetime of the running backend instance.
