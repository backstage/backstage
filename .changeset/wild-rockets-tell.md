---
'@backstage/plugin-auth-backend-module-azure-easyauth-provider': minor
---

New auth backend module to add `azure-easyauth` provider. Note that as part of this change the default provider ID has been changed from `easyAuth` to `azureEasyAuth`, which means you need to update your app config as well as the `provider` prop of the `ProxiedSignInPage` in the frontend.
