---
'@backstage/backend-app-api': minor
'@backstage/backend-common': minor
'@backstage/backend-defaults': minor
'@backstage/backend-plugin-api': minor
'@backstage/backend-test-utils': minor
'@backstage/plugin-auth-backend-module-atlassian-provider': minor
'@backstage/plugin-auth-backend-module-aws-alb-provider': minor
'@backstage/plugin-auth-backend-module-azure-easyauth-provider': minor
'@backstage/plugin-auth-backend-module-bitbucket-provider': minor
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': minor
'@backstage/plugin-auth-backend-module-gcp-iap-provider': minor
'@backstage/plugin-auth-backend-module-github-provider': minor
'@backstage/plugin-auth-backend-module-gitlab-provider': minor
'@backstage/plugin-auth-backend-module-google-provider': minor
'@backstage/plugin-auth-backend-module-guest-provider': minor
'@backstage/plugin-auth-backend-module-microsoft-provider': minor
'@backstage/plugin-auth-backend-module-oauth2-provider': minor
'@backstage/plugin-auth-backend-module-oauth2-proxy-provider': minor
'@backstage/plugin-auth-backend-module-oidc-provider': minor
'@backstage/plugin-auth-backend-module-okta-provider': minor
'@backstage/plugin-auth-backend-module-onelogin-provider': minor
'@backstage/plugin-auth-backend-module-pinniped-provider': minor
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': minor
'@backstage/plugin-auth-backend': minor
'@backstage/plugin-catalog-backend-module-backstage-openapi': minor
'@backstage/plugin-catalog-backend-module-gcp': minor
'@backstage/plugin-catalog-backend-module-github-org': minor
'@backstage/plugin-catalog-backend-module-gitlab-org': minor
'@backstage/plugin-catalog-backend-module-ldap': minor
'@backstage/plugin-catalog-backend-module-logs': minor
'@backstage/plugin-catalog-backend-module-openapi': minor
'@backstage/plugin-catalog-backend-module-scaffolder-entity-model': minor
'@backstage/plugin-catalog-backend-module-unprocessed': minor
'@backstage/plugin-devtools-backend': minor
'@backstage/plugin-events-node': minor
'@backstage/plugin-notifications-backend-module-email': minor
'@backstage/plugin-notifications-backend': minor
'@backstage/plugin-permission-backend-module-allow-all-policy': minor
'@backstage/plugin-scaffolder-backend-module-azure': minor
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': minor
'@backstage/plugin-scaffolder-backend-module-bitbucket-server': minor
'@backstage/plugin-scaffolder-backend-module-bitbucket': minor
'@backstage/plugin-scaffolder-backend-module-confluence-to-markdown': minor
'@backstage/plugin-scaffolder-backend-module-cookiecutter': minor
'@backstage/plugin-scaffolder-backend-module-gcp': minor
'@backstage/plugin-scaffolder-backend-module-gerrit': minor
'@backstage/plugin-scaffolder-backend-module-gitea': minor
'@backstage/plugin-scaffolder-backend-module-github': minor
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
'@backstage/plugin-scaffolder-backend-module-notifications': minor
'@backstage/plugin-scaffolder-backend-module-rails': minor
'@backstage/plugin-scaffolder-backend-module-sentry': minor
'@backstage/plugin-scaffolder-backend-module-yeoman': minor
'@backstage/plugin-search-backend-module-stack-overflow-collator': minor
'@backstage/plugin-signals-backend': minor
---

**BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.
