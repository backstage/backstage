---
'@backstage/backend-defaults': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-auth-backend-module-auth0-provider': patch
'@backstage/plugin-auth-backend-module-aws-alb-provider': patch
'@backstage/plugin-auth-backend-module-azure-easyauth-provider': patch
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
'@backstage/plugin-auth-backend-module-oauth2-proxy-provider': patch
'@backstage/plugin-auth-backend-module-oidc-provider': patch
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': patch
'@backstage/plugin-auth-node': patch
---

Updated dependency `jose` to `^6.1.0`. Existing ES256 token issuance and verification are unchanged. ML-DSA algorithms can be used when the runtime supports them.
