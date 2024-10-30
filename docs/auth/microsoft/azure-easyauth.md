---
id: easy-auth
title: Azure EasyAuth Provider
sidebar_label: Azure Easy Auth
description: Adding Azure's EasyAuth Proxy as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Microsoft authentication provider that can authenticate users using Microsoft Entra ID (formerly Azure Active Directory) for PaaS service hosted in Azure that support Easy Auth, such as Azure App Services.

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

## Configuration

Add the following into your `app-config.yaml` under the root `auth` configuration:

```yaml title="app-config.yaml"
auth:
  providers:
    azureEasyAuth:
      signIn:
        resolvers:
          # See https://backstage.io/docs/auth/microsoft/easy-auth#resolvers for more resolvers
          - resolver: idMatchingUserEntityAnnotation
```

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.
- `idMatchingUserEntityAnnotation`: Matches the user Id from the auth provider with the User entity that has a matching `graph.microsoft.com/user-id` annotation. If no match is found it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-azure-easyauth-provider
```

Then we will need to this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-azure-easyauth-provider'),
);
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page, and to also make it work smoothly for local development. You'll use `azureEasyAuth` as the provider name.

If you [provide a custom sign in resolver](https://backstage.io/docs/auth/identity-resolver#building-custom-resolvers), you can skip the `signIn` block entirely.
