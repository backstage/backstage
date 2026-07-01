---
'@backstage/config-loader': minor
---

Configuration schemas declared in TypeScript now resolve and validate imported types instead of treating them as unconstrained values. Invalid imports now cause schema loading to fail.
