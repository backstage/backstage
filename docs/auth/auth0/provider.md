---
id: provider
title: Auth0 Authentication Provider
sidebar_label: Auth0
description: Adding Auth0 as an authentication provider in Backstage
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage
[version 1.24](../../releases/v1.24.0.md). If you are still on the old backend
system, you may want to read [its own article](./provider--old.md)
instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The Backstage `core-plugin-api` package comes with an Auth0 authentication
provider that can authenticate users using OAuth.

## Create an Auth0 Application

1. Log in to the [Auth0 dashboard](https://manage.auth0.com/dashboard/)
2. Navigate to **Applications**
3. Create an Application
   - Name: Backstage (or your custom app name)
   - Application type: Single Page Web Application
4. Click on the Settings tab.
5. Add under `Application URIs` > `Allowed Callback URLs`:
   `http://localhost:7007/api/auth/auth0/handler/frame`
6. Click `Save Changes`.

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    auth0:
      development:
        clientId: ${AUTH_AUTH0_CLIENT_ID}
        clientSecret: ${AUTH_AUTH0_CLIENT_SECRET}
        domain: ${AUTH_AUTH0_DOMAIN_ID}
        audience: ${AUTH_AUTH0_AUDIENCE}
        connection: ${AUTH_AUTH0_CONNECTION}
        connectionScope: ${AUTH_AUTH0_CONNECTION_SCOPE}
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
  session:
    secret: ${AUTH_SESSION_SECRET}
```

The Auth0 provider is a structure with these configuration keys:

- `clientId`: The Application client ID, found on the Auth0 Application page.
- `clientSecret`: The Application client secret, found on the Auth0 Application
  page.
- `domain`: The Application domain, found on the Auth0 Application page.

It additionally relies on the following configuration to function:

- `session.secret`: The session secret is a key used for signing and/or encrypting cookies set by the application to maintain session state. In this case, 'your session secret' should be replaced with a long, complex, and unique string that only your application knows.

Auth0 requires a session, so you need to give the session a secret key.

### Optional

- `audience`: The intended recipients of the token.
- `connection`: Social identity provider name. To check the available social connections, please visit [Auth0 Social Connections](https://marketplace.auth0.com/features/social-connections).
- `connectionScope`: Additional scopes in the interactive token request. It should always be used in combination with the `connection` parameter.
- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend, we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-auth0-provider
```

Then we will need to add this line:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
//...
backend.add(import('@backstage/plugin-auth-backend'));
// highlight-add-next-line
backend.add(import('@backstage/plugin-auth-backend-module-auth0-provider'));
//...
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `auth0AuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
