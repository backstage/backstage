---
'@backstage/app-defaults': patch
'@backstage/core-plugin-api': patch
'@backstage/core-app-api': patch
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
---

Introduced UtilityAPI for Pinniped, which presents the getClusterScopedIdToken function to get a Cluster Scoped ID Token which can be passed to backend services to exchange it for mTLS x509 client certs
