---
'@backstage/backend-plugin-api': major
'@backstage/backend-app-api': major
'@backstage/backend-test-utils': major
---

Release 1.0 of the new backend system! :tada:

The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).
