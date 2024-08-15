---
'@backstage/backend-plugin-api': minor
'@backstage/plugin-auth-backend-module-atlassian-provider': minor
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': minor
'@backstage/plugin-auth-backend-module-azure-easyauth-provider': minor
'@backstage/plugin-auth-backend-module-oauth2-proxy-provider': minor
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': minor
'@backstage/plugin-auth-backend-module-bitbucket-provider': minor
'@backstage/plugin-auth-backend-module-microsoft-provider': minor
'@backstage/plugin-auth-backend-module-onelogin-provider': minor
'@backstage/plugin-auth-backend-module-pinniped-provider': minor
'@backstage/plugin-auth-backend-module-aws-alb-provider': minor
'@backstage/plugin-auth-backend-module-gcp-iap-provider': minor
'@backstage/plugin-auth-backend-module-github-provider': minor
'@backstage/plugin-auth-backend-module-gitlab-provider': minor
'@backstage/plugin-auth-backend-module-google-provider': minor
'@backstage/plugin-auth-backend-module-oauth2-provider': minor
'@backstage/plugin-auth-backend-module-guest-provider': minor
'@backstage/plugin-auth-backend-module-oidc-provider': minor
'@backstage/plugin-auth-backend-module-okta-provider': minor
'@backstage/plugin-auth-backend': minor
'@backstage/plugin-catalog-backend-module-openapi': minor
'@backstage/plugin-catalog-backend-module-gcp': minor
'@backstage/plugin-catalog-backend-module-github-org': minor
'@backstage/plugin-catalog-backend-module-gitlab-org': minor
'@backstage/plugin-catalog-backend-module-ldap': minor
'@backstage/plugin-catalog-backend-module-logs': minor
'@backstage/plugin-catalog-backend-module-backstage-openapi': minor
'@backstage/plugin-catalog-backend-module-scaffolder-entity-model': minor
'@backstage/plugin-catalog-backend-module-unprocessed': minor
'@backstage/plugin-devtools-backend': minor
'@backstage/plugin-notifications-backend-module-email': minor
'@backstage/plugin-notifications-backend': minor
'@backstage/plugin-permission-backend-module-allow-all-policy': minor
'@backstage/plugin-scaffolder-backend-module-confluence-to-markdown': minor
'@backstage/plugin-scaffolder-backend-module-bitbucket-server': minor
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': minor
'@backstage/plugin-scaffolder-backend-module-notifications': minor
'@backstage/plugin-scaffolder-backend-module-cookiecutter': minor
'@backstage/plugin-scaffolder-backend-module-bitbucket': minor
'@backstage/plugin-scaffolder-backend-module-gerrit': minor
'@backstage/plugin-scaffolder-backend-module-github': minor
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
'@backstage/plugin-scaffolder-backend-module-sentry': minor
'@backstage/plugin-scaffolder-backend-module-yeoman': minor
'@backstage/plugin-scaffolder-backend-module-azure': minor
'@backstage/plugin-scaffolder-backend-module-gitea': minor
'@backstage/plugin-scaffolder-backend-module-rails': minor
'@backstage/plugin-scaffolder-backend-module-gcp': minor
'@backstage/plugin-search-backend-module-stack-overflow-collator': minor
'@backstage/plugin-signals-backend': minor
---

**BREAKING**: The return values from `createBackendPlugin` and `createBackendModule` are now simply `BackendFeature`, instead of the previously deprecated form of a function that returns a feature.

This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins and modules.
