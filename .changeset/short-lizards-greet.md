---
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': patch
'@backstage/plugin-auth-backend-module-atlassian-provider': patch
'@backstage/plugin-auth-backend-module-bitbucket-provider': patch
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
'@backstage/plugin-auth-backend-module-onelogin-provider': patch
'@backstage/plugin-auth-backend-module-aws-alb-provider': patch
'@backstage/plugin-auth-backend-module-gcp-iap-provider': patch
'@backstage/plugin-auth-backend-module-github-provider': patch
'@backstage/plugin-auth-backend-module-gitlab-provider': patch
'@backstage/plugin-auth-backend-module-google-provider': patch
'@backstage/plugin-auth-backend-module-oauth2-provider': patch
'@backstage/plugin-auth-backend-module-oidc-provider': patch
'@backstage/plugin-auth-backend-module-okta-provider': patch
'@backstage/plugin-auth-node': patch
---

feat: add utility types for auth providers

This update introduces a new type, `CommonSignInResolver`, along with two utility types, `GetSignInResolverOption` and `GetSignInResolver`. These additions aim to minimize the chances of omitting a type in `config.d.ts`.
