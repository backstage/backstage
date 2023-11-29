---
'@backstage/backend-app-api': minor
'@backstage/backend-common': minor
'@backstage/config-loader': minor
'@backstage/plugin-app-backend': minor
'@backstage/backend-dynamic-feature-service': minor
---

Allow referencing additional configuration schemas at runtime (application start), and have them taken in account where schemas are used:

- the backed-app plugin, in order to prepare the frontend configuration
- the backend application loggers, in order to hide secret configuration values (defined in the schemas).
