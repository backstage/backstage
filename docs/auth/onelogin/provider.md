---
id: provider
title: OneLogin Authentication Provider
sidebar_label: OneLogin
description: Adding OneLogin OIDC as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a OneLogin authentication
provider that can authenticate users using OpenID Connect.

## Create an Application on OneLogin

To support OneLogin authentication, you must create an Application:

1. From the OneLogin Admin portal, choose Applications
2. Click `Add App` and select `OpenID Connect`
   - Display Name: Backstage (or your custom app name)
3. Click Save
4. Go to the Configuration tab for the Application and set:
   - `Login Url`: `http://localhost:3000`
   - `Redirect URIs`: `http://localhost:7007/api/auth/onelogin/handler/frame`
5. Click Save
6. Go to the SSO tab for the Application and set:
   - `Token Endpoint` > `Authentication Method`: `POST`
7. Click Save

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    onelogin:
      development:
        clientId: ${AUTH_ONELOGIN_CLIENT_ID}
        clientSecret: ${AUTH_ONELOGIN_CLIENT_SECRET}
        issuer: https://<company>.onelogin.com/oidc/2
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/onelogin/provider#resolvers for more resolvers
            - resolver: usernameMatchingUserEntityName
```

The OneLogin provider is a structure with three configuration keys; **these are
found on the SSO tab** for the OneLogin Application:

- `clientId`: The client ID
- `clientSecret`: The client secret
- `issuer`: The issuer URL

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.
- `usernameMatchingUserEntityName`: Matches the username from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-onelogin-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-onelogin-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `oneloginAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
