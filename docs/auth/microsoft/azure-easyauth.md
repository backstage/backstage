---
id: easy-auth
title: Azure EasyAuth Provider
sidebar_label: Azure Easy Auth
description: Adding Azure's EasyAuth Proxy as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Microsoft authentication provider that can authenticate users using Azure Active Directory for PaaS service hosted in Azure that support Easy Auth, such as Azure App Services.

## Backstage Changes

Add the following into your `app-config.yaml` or `app-config.production.yaml` file

Add a `providerFactories` entry to the router in
`packages/backend/src/plugins/auth.ts`.

```ts
import { providers } from '@backstage/plugin-auth-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const authProviderFactories = {
    'azure-easyauth': providers.easyAuth.create({
      signIn: {
        resolver: async (info, ctx) => {
          const {
            fullProfile: { id },
          } = info.result;

          if (!id) {
            throw new Error('User profile contained no id');
          }

          return await ctx.signInWithCatalogUser({
            annotations: {
              'graph.microsoft.com/user-id': id,
            },
          });
        },
      },
    }),
  };

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: authProviderFactories,
  });
}
```

Now the backend is ready to serve auth requests on the
`/api/auth/azure-easyauth/refresh` endpoint. All that's left is to update the frontend
sign-in mechanism to poll that endpoint through the IAP, on the user's behalf.

## Frontend Changes

It is recommended to use the `ProxiedSignInPage` for this provider, which is
installed in `packages/app/src/App.tsx` like this:

```tsx title="packages/app/src/App.tsx"
/* highlight-add-next-line */
import { ProxiedSignInPage } from '@backstage/core-components';

const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => (
      <ProxiedSignInPage {...props} provider="azure-easyauth" />
    ),
  },
  /* highlight-add-end */
  // ..
});
```

See the [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) section for more information.

## Azure Configuration

How to configure azure depends on the service you're enable AAD auth on the app service.

### Azure App Services

To use EasyAuth with App Services, turn on Active Directory authentication
You must also enable the token store.

The following example shows how to do this via a bicep template:

```bicep
resource webApp 'Microsoft.Web/sites@2022-03-01' existing = {
  name: 'MY-WEBAPP-NAME'

  resource authConfig 'config' = {
    name: 'authsettingsV2'
    properties: {
      globalValidation: {
        redirectToProvider: 'AzureActiveDirectory'
        requireAuthentication: true
        unauthenticatedClientAction: 'RedirectToLoginPage'
      }
      login: {
        tokenStore: {
          enabled: true
        }
      }
      platform: {
        enabled: true
      }
      identityProviders: {
        azureActiveDirectory: {
          enabled: true
          login: {
            loginParameters: [ 'domain_hint=MYCOMPANY.COM' ]
          }
          registration: {
            clientId: 'CLIENT-ID'
            clientSecretSettingName: 'CLIENT-SECRET-NAME'
            openIdIssuer: 'https://sts.windows.net/${tenant().tenantId}/v2.0'
          }
        }
      }
    }
  }
}
```
