---
'@backstage/backend-common': patch
---

The `TokenManager` has been deprecated in preparation for the [stable release of the New Backend System](https://github.com/backstage/backstage/issues/24493). Please [migrate](https://backstage.io/docs/tutorials/auth-service-migration) to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead.
