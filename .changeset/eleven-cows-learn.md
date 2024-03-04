---
'@backstage/backend-plugin-api': patch
---

Added the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/), [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth), and [`userInfo`](https://backstage.io/docs/backend-system/core-services/user-info) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution) to the `coreServices`.

At the same time, the [`httpRouter`](https://backstage.io/docs/backend-system/core-services/http-router) service gained a new `addAuthPolicy` method that lets your plugin declare exemptions to the default auth policy - for example if you want to allow unauthenticated or cookie-based access to some subset of your feature routes.

If you have migrated to the new backend system, please see the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on how to move toward using these services.
