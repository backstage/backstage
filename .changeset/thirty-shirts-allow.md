---
'@backstage/backend-common': patch
---

Added a `createLegacyAuthAdapters` function that can be used as a compatibility adapter for backend plugins who want to start using the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/) and [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution).

See the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on the usage of this adapter.
