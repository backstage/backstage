---
'@backstage/backend-test-utils': patch
---

Added support for the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/) and [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution). These services will be present by default in test apps, and you can access mocked versions of their features under `mockServices.auth` and `mockServices.httpAuth` if you want to inspect or replace their behaviors.

There is also a new `mockCredentials` that you can use for acquiring mocks of the various types of credentials that are used in the new system.
