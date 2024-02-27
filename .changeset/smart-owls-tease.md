---
'@backstage/backend-app-api': minor
---

**BREAKING**: For users that have migrated to the new backend system, incoming requests will now be rejected if they are not properly authenticated (e.g. with a Backstage bearer token or a backend token). Please see the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on how to circumvent this behavior in the short term and how to properly leverage it in the longer term.

Added service factories for the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/), [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth), and [`userInfo`](https://backstage.io/docs/backend-system/core-services/user-info) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution).
