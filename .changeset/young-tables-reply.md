---
'@backstage/backend-common': patch
'@backstage/cli': patch
'@backstage/config-loader': patch
'@backstage/create-app': patch
'@backstage/techdocs-common': patch
'@backstage/plugin-app-backend': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-rollbar-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-techdocs-backend': patch
---

Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
