---
'@backstage/plugin-permission-backend': patch
---

Migrated to use the new auth services introduced in [BEP-0003](https://github.com/backstage/backstage/blob/master/beps/0003-auth-architecture-evolution/README.md).

The `createRouter` function now has an optional `identity` argument, and instead gained the new `auth`, `httpAuth`, and `userInfo` arguments that should be set to the values of those respective `coreServices`. For users of the new backend system, this happens automatically without code changes.
