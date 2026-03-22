---
'@backstage/plugin-auth-backend-module-atlassian-provider': patch
'@backstage/plugin-auth-backend-module-aws-alb-provider': patch
'@backstage/plugin-auth-backend-module-azure-easyauth-provider': patch
'@backstage/plugin-auth-backend-module-bitbucket-provider': patch
'@backstage/plugin-auth-backend-module-bitbucket-server-provider': patch
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
'@backstage/plugin-auth-backend-module-gcp-iap-provider': patch
'@backstage/plugin-auth-backend-module-github-provider': patch
'@backstage/plugin-auth-backend-module-gitlab-provider': patch
'@backstage/plugin-auth-backend-module-google-provider': patch
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
'@backstage/plugin-auth-backend-module-oauth2-provider': patch
'@backstage/plugin-auth-backend-module-oauth2-proxy-provider': patch
'@backstage/plugin-auth-backend-module-okta-provider': patch
'@backstage/plugin-auth-backend-module-onelogin-provider': patch
'@backstage/plugin-auth-backend-module-openshift-provider': patch
---

Migrated Zod usage from v3 to v4 and updated sign-in resolver option schemas to use Zod `.prefault()` instead of `.optional()` with JavaScript-level parameter defaults, aligning with the updated `SignInResolverFactoryOptions` interface in `@backstage/plugin-auth-node`.
