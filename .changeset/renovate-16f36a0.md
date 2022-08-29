---
'@backstage/backend-common': patch
'@backstage/plugin-app-backend': patch
'@backstage/plugin-graphql-backend': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-vault-backend': patch
---

Updated dependency `helmet` to `^6.0.0`.

Please note that these policies are no longer applied by default:

helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.
