---
id: provider
title: Keycloak Authentication Provider
sidebar_label: Keycloak
description: Adding Keycloak as an authentication provider in Backstage
---

Backstage can authenticate users using [Keycloak](https://www.keycloak.org/)
OpenID Connect. This provider is available through the community-maintained
[`@backstage-community/plugin-auth-backend-module-keycloak-provider`](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/auth-backend-module-keycloak)
module.

## Create a client on Keycloak

Create an OpenID Connect client with **Client authentication** enabled and
`<backend-url>/api/auth/keycloak/handler/frame` as a valid redirect URI. See the
[module documentation](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/auth-backend-module-keycloak#create-a-client-on-keycloak)
for the full steps.

## Configuration

The provider configuration can then be added to your `app-config.yaml` under
the root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    keycloak:
      development:
        clientId: ${AUTH_KEYCLOAK_CLIENT_ID}
        clientSecret: ${AUTH_KEYCLOAK_CLIENT_SECRET}
        baseUrl: ${AUTH_KEYCLOAK_BASE_URL}
        realm: ${AUTH_KEYCLOAK_REALM}
        signIn:
          resolvers:
            # See the module documentation for more resolvers
            - resolver: preferredUsernameMatchingUserEntityName
```

The Keycloak provider is a structure with these configuration keys:

- `clientId`: The client ID that you registered on Keycloak, for example
  `backstage`.
- `clientSecret`: The client secret generated for the client in Keycloak.
- `baseUrl`: The base URL of the Keycloak server, without a trailing
  `/realms/...` path, for example `https://keycloak.example.com`.
- `realm`: The name of the Keycloak realm that Backstage authenticates
  against.

Optional configuration such as `additionalScopes`, `postLogoutRedirectUri`,
and `prompt` is described in the
[configuration reference](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/auth-backend-module-keycloak#configuration).

Available sign-in resolvers are listed in the
[module's sign-in resolvers](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/auth-backend-module-keycloak#sign-in-resolvers).
If none of them fit your needs, see
[Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers).

## Backend installation

To add the provider to the backend we will first need to install the package
by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage-community/plugin-auth-backend-module-keycloak-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage-community/plugin-auth-backend-module-keycloak-provider'),
);
/* highlight-add-end */
```

## Synchronizing users and groups

The sign-in resolvers require a matching User entity to already exist in the
Software Catalog. The recommended way to achieve this is to install the
community-maintained
[`@backstage-community/plugin-catalog-backend-module-keycloak`](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/catalog-backend-module-keycloak)
plugin, which synchronizes Keycloak users and groups into the catalog on a
schedule. See
[Keycloak Organizational Data](../../integrations/keycloak/org.md) for more
information.

## Adding the provider to the Backstage frontend

Backstage does not ship a built-in auth API for Keycloak, so you need to
create and register a Keycloak auth API reference in your app. The
[module documentation](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/auth-backend-module-keycloak#adding-the-provider-to-the-backstage-frontend)
contains a complete example. Then add the `SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
