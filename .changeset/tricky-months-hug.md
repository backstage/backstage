---
'@backstage/plugin-auth-backend-module-oauth2-proxy-provider': patch
'@backstage/plugin-auth-backend-module-aws-alb-provider': patch
'@backstage/plugin-auth-backend-module-gcp-iap-provider': patch
'@backstage/plugin-auth-node': patch
---

Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
