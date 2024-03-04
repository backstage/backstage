---
'@backstage/plugin-permission-backend': patch
---

Migrated to use the new auth services introduced in [BEP-0003](https://github.com/backstage/backstage/blob/master/beps/0003-auth-architecture-evolution/README.md).

The `createRouter` function now accepts `auth`, `httpAuth` and `userInfo` options. Theses are used internally to support the new backend system, and can be ignored.
