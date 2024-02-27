---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The `CatalogIdentityClient` constructor now also requires the `discovery` service to be forwarded from the plugin environment. This is part of the migration to support the new auth services, which has also been done for the `createRouter` function.
