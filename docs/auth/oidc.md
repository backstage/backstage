---
id: oidc
title: OIDC provider from scratch
description: This section shows how to enable and use the Backstage OIDC provider.
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./oidc--old.md)
instead.
::::

This section shows how to enable and use the Backstage OIDC provider.

## Summary

OIDC is a protocol which has numerous implementations. It's likely that many of your users won't know what the OIDC **protocol** is, but they will recognise your OIDC **implementation**. Backstage supplies a generic `oidc` authorization strategy. You should re-badge this with the name and branding of your OIDC implementation, so that your users will recognise it on the Backstage sign-in page.

For example, if your organization uses [Keycloak](https://www.keycloak.org), you would re-badge the OIDC provider as `Keycloak` and tell users to `Sign In using Keycloak`.

## Steps

The Backstage OIDC provider is not enabled by default. You need to:

1. Install and configure the OIDC backend module.
1. Configure the provider in `app-config.yaml`.
1. Configure a sign-in resolver.
1. Add the provider to the Backstage sign-in page.

For simplicity, we assume that you only have a single OIDC provider in your Backstage installation.

We'll explain each step in detail next.

### Backend Installation

To add the OIDC provider to the backend, install the provider module:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-oidc-provider
```

Then add it to your backend in `packages/backend/src/index.ts`:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'));
```

### Configuration

Register an OIDC client application for Backstage with your OIDC provider (for example, Keycloak). Then add the provider configuration to your `app-config.yaml`:

```yaml title="app-config.yaml"
auth:
  environment: development
  session:
    secret: ${AUTH_SESSION_SECRET}
  providers:
    oidc:
      development:
        metadataUrl: https://example.com/.well-known/openid-configuration
        clientId: ${AUTH_OIDC_CLIENT_ID}
        clientSecret: ${AUTH_OIDC_CLIENT_SECRET}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

Anything enclosed in `${}` can be replaced directly in the YAML, or provided as environment variables.

#### Required parameters

These parameters must always be set.

- `clientId`: The client ID from your OIDC provider.
- `clientSecret`: The client secret tied to the client ID.
- `metadataUrl`: The OpenID Connect metadata document URL, for example `https://example.com/.well-known/openid-configuration`.

The OIDC provider **also** requires `auth.session.secret` to be set.

#### Optional parameters

These parameters have implicit default values. Don't override them unless you know what you're doing.

- `callbackUrl`: Override the default callback URL used by the OIDC provider.
- `timeout`: Override the default timeout for calls to the OIDC provider.
- `tokenEndpointAuthMethod`
- `tokenSignedResponseAlg`
- `additionalScopes`: Requests additional scopes on top of the default `openid profile
email` scopes. Do not configure `scope` directly, as the OIDC provider will reject
  configurations that include it.
- `prompt`: Recommended to use `auto` so the browser will request sign-in to the identity
  provider if the user has no active session.
- `sessionDuration`: Lifespan of the user session.
- `startUrlSearchParams`: A dictionary of search (query) parameters for the OIDC
  authorization start URL. Don't define it unless you want to change the identity
  provider's behavior. (For example, you could set the `organization` parameter to guide
  users towards a particular sign-in option that your organization prefers.) **Note:** the
  start URL is controlled by the browser, so this feature is only for improving the
  Backstage user experience.

:::note Config Reloading
Backstage does not yet support hot reloading of auth provider configuration. Any changes to this YAML file require a restart of Backstage.
:::

### Resolvers

Resolvers map the user identity from the OIDC provider to the Backstage user identity.

The default OIDC provider has a choice of built-in resolvers that you configure in `app-config.yaml` under `auth.providers.oidc.<environment>.signIn.resolvers`:

```yaml title="app-config.yaml"
auth:
  providers:
    oidc:
      development:
        # ...
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

If none of the built-in resolvers are suitable, you can write a custom resolver. See [Building Custom Resolvers](./identity-resolver.md#building-custom-resolvers) for details.

The following example shows a custom resolver that maps users by their OIDC `sub` claim:

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';

const myAuthProviderModule = createBackendModule({
  pluginId: 'auth',
  moduleId: 'custom-oidc-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'oidc',
          factory: createOAuthProviderFactory({
            authenticator: oidcAuthenticator,
            async signInResolver(info, ctx) {
              const userRef = stringifyEntityRef({
                kind: 'User',
                name: info.result.fullProfile.userinfo.sub,
                namespace: DEFAULT_NAMESPACE,
              });
              return ctx.issueToken({
                claims: {
                  sub: userRef,
                  ent: [userRef],
                },
              });
            },
          }),
        });
      },
    });
  },
});
/* highlight-add-end */

// ...
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
// Use the custom module instead of the default OIDC module
backend.add(myAuthProviderModule);
/* highlight-add-end */
```

For a more detailed explanation about resolvers, see the [Identity Resolver](./identity-resolver.md) page.

### Adding the provider to the sign-in page

The last step is to configure the sign-in page in the frontend to use your OIDC provider.

Since OIDC does not have a built-in auth API ref in `@backstage/core-plugin-api`, you need to create a custom one and wire it up using a `SignInPageBlueprint`. The following example shows how to set this up for a Keycloak-branded OIDC provider in `packages/app/src/App.tsx`:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
/* highlight-add-start */
import {
  OpenIdConnectApi,
  ProfileInfoApi,
  BackstageIdentityApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import {
  createApiRef,
  createFrontendModule,
  configApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';

const keycloakAuthApiRef = createApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>().with({
  id: 'auth.keycloak',
});

const keycloakAuthApi = ApiBlueprint.make({
  name: 'keycloak',
  params: defineParams =>
    defineParams({
      api: keycloakAuthApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        oauthRequestApi: oauthRequestApiRef,
        configApi: configApiRef,
      },
      factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
        OAuth2.create({
          configApi,
          discoveryApi,
          oauthRequestApi,
          environment: configApi.getOptionalString('auth.environment'),
          provider: {
            id: 'oidc',
            title: 'Keycloak',
            icon: () => null,
          },
          defaultScopes: ['openid', 'profile', 'email'],
        }),
    }),
});

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      (
        <SignInPage
          {...props}
          provider={{
            id: 'keycloak-auth-provider',
            title: 'Keycloak',
            message: 'Sign In using Keycloak',
            apiRef: keycloakAuthApiRef,
          }}
        />
      ),
  },
});
/* highlight-add-end */

export default createApp({
  features: [
    // ...
    /* highlight-add-start */
    createFrontendModule({
      pluginId: 'app',
      extensions: [keycloakAuthApi, signInPage],
    }),
    /* highlight-add-end */
  ],
});
```

The `id` of the API ref (e.g. `'auth.keycloak'`) and the `id` used in the `SignInPage` provider configuration (e.g. `'keycloak-auth-provider'`) can be customized. However, the `provider.id` passed to `OAuth2.create` must remain `'oidc'` to match Backstage's generic OIDC auth strategy on the backend.

:::note Note
You can configure sign-in to use a redirect flow with no pop-up by adding `enableExperimentalRedirectFlow: true` to the root of your `app-config.yaml`.
:::

For more information about sign-in configuration, see [Sign-in Configuration](./index.md#sign-in-configuration).
