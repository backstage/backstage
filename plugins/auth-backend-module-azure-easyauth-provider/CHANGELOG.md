# @backstage/plugin-auth-backend-module-azure-easyauth-provider

## 0.1.0

### Minor Changes

- 06a6725: New auth backend module to add `azure-easyauth` provider. Note that as part of this change the default provider ID has been changed from `easyAuth` to `azureEasyAuth`, which means that if you switch to this new module you need to update your app config as well as the `provider` prop of the `ProxiedSignInPage` in the frontend.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
