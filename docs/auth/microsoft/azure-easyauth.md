---
id: easy-auth
title: Azure EasyAuth Provider
sidebar_label: Azure Easy Auth
description: Adding Azure's EasyAuth Proxy as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Microsoft authentication provider that can authenticate users using Microsoft Entra ID (formerly Azure Active Directory) for PaaS service hosted in Azure that support Easy Auth, such as Azure App Services.

## Backend Changes

Add the following into your `app-config.yaml` under the root `auth` configuration:

```yaml title="app-config.yaml"
auth:
  providers:
    azureEasyAuth:
      signIn:
        resolvers:
          - resolver: idMatchingUserEntityAnnotation
          - resolver: emailMatchingUserEntityProfileEmail
          - resolver: emailLocalPartMatchingUserEntityName
```

The `idMatchingUserEntityAnnotation` is
[a builtin sign-in resolver](../identity-resolver.md#using-builtin-resolvers) from `azureEasyAuth` provider.
It tries to find a user entity with [a `graph.microsoft.com/user-id` annotation](../../features/software-catalog/well-known-annotations.md#graphmicrosoftcomtenant-id-graphmicrosoftcomgroup-id-graphmicrosoftcomuser-id)
which matches the object ID of the user attempting to sign in.
If you want to provide your own sign-in resolver,
see [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers).

Add the `@backstage/plugin-auth-backend-module-azure-easyauth-provider` to your backend installation.

```sh
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-azure-easyauth-provider
```

Then, add it to your backend's source,

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
// highlight-add-next-line
backend.add(
  import('@backstage/plugin-auth-backend-module-azure-easyauth-provider'),
);

await backend.start();
```

Now the backend is ready to serve auth requests on the
`/api/auth/azureEasyAuth/refresh` endpoint. All that's left is to update the frontend
sign-in mechanism to poll that endpoint through the Easy Auth proxy, on the user's behalf.

## Frontend Changes

To use this component, you'll need to configure the app's `SignInPage`.
It is recommended to use the `ProxiedSignInPage` for this provider when running in Azure, However for local development (or any other scenario running outside of Azure), you'll want to set up something different.
For the closest experience to Easy Auth, you could set up the `microsoft` provider locally, but that will requires setting up App Registrations & secrets which may be locked down by your organisation, in which case it may be easier to use guest login locally.
See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for more details.

```tsx title="packages/app/src/App.tsx"
/* highlight-add-next-line */
import { ProxiedSignInPage } from '@backstage/core-components';

const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      if (configApi.getString('auth.environment') !== 'development') {
        return <ProxiedSignInPage {...props} provider="azureEasyAuth" />;
      }
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom']}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
  /* highlight-add-end */
  // ..
});
```

## Azure Configuration

How to configure azure depends on the Azure service you're using to host Backstage.

### Azure App Services

To use EasyAuth with App Services, turn on Entra ID (formerly Azure Active Directory) authentication
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
