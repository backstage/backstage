---
id: oidc
title: OIDC provider from scratch
description: This section shows how to enable and use the Backstage OIDC provider.
---

:::info
This documentation is written for [the new backend system](../backend-system/index.md) which is the default since Backstage
[version 1.24](../releases/v1.24.0.md). If you are still on the old backend
system, you may want to read [its own article](https://github.com/backstage/backstage/blob/v1.37.0/docs/auth/oidc--old.md)
instead, and [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

This section shows how to enable and use the Backstage OIDC provider.

## Summary

OIDC is a protocol which has numerous implementations. It's likely that many of your users won't know what the OIDC **protocol** is, but they will recognise your OIDC **implementation**. Backstage supplies a generic `oidc` authorization strategy. You should re-badge this with the name and branding of your OIDC implementation, so that your users will recognise it on the Backstage sign-in page.

For example, if your organization uses [Keycloak](https://www.keycloak.org), you would re-badge the OIDC provider as `Keycloak` and tell users to `Sign In using Keycloak`.

## Steps

The Backstage OIDC provider is not enabled by default. You need to manually enable the provider, and tell it which OIDC server you want to use.

To enable the Backstage OIDC provider:

- Create an API reference to identify the provider.
- Create the API factory that will handle the authentication.
- Add or reuse an auth provider so you can authenticate.
- Add or reuse a resolver to handle the result from the authentication.
- Configure the provider to access your 3rd party auth solution.
- Add the provider to the Backstage sign-in page.

For simplicity, we assume that you only have a single OIDC provider in your Backstage installation. (If you need to have multiple OIDC providers in Backstage, the steps will be different.)

We'll explain each step more in detail next.

### The API Reference

An API reference exists to enable **Dependency Injection**. (See [Utility APIs][4] for an extended explanation.)

In this example, we'll create the API ref directly in the `packages/app/src/apis.ts` file. It is not a requirement to put the ref in this file. Any location will do as long as it's available to be imported to where the API factory is, as well as easily accessible to the rest of the application so any package and plugin can inject the API instance when necessary.

```ts
export const keycloakAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'auth.keycloak',
});
```

The `id` of the API ref can be anything you want, as long as it doesn't conflict with other refs. Backstage recommends to use a custom name that references your custom provider.

:::note TypeScript Note
As we're exporting this API reference, as well as the TypeScript types, we need to
be able to import this reference anywhere in the app. The types will tell TypeScript
what instance we're getting from DI when injecting the API. In this case we are defining
an API for authentication, so we tell TS that this instance complies with 4 API
interfaces:

- The OIDC API that will handle authentication.
- Profile API for requesting user profile info from the auth provider in question.
- Backstage identity API to handle and associate the user profile with backstage identity.
- Session API, to handle the session the user will have while signed in.
  :::

### The API Factory (and auth provider)

The Backstage API factories are part of the Backstage Dependency Injection system. The factory function runs once, when something in your Backstage app first attempts to use an instance of the API it provides. The instance is then cached by the DI system for subsequent lookups.

Let's add a new API factory to the `apis` array in the `packages/app/src/apis.ts` file. We will tell it to use the OIDC auth provider internally.

```ts title="packages/app/src/apis.ts"
/* highlight-add-next-line */
import { OAuth2 } from '@backstage/core-app-api';

export const apis: AnyApiFactory[] = [
  /* highlight-add-start */
  createApiFactory({
    api: keycloakAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      // delegate auth to the OAuth2 strategy
      OAuth2.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        provider: {
          // this value MUST be 'oidc'
          // it maps our Keycloak-branded sign-in provider onto Backstage's generic OIDC auth strategy
          id: 'oidc',
          title: 'Keycloak',
          icon: () => null,
        },
        environment: configApi.getOptionalString('auth.environment'),
        defaultScopes: ['openid', 'profile', 'email'],
        popupOptions: {
          // optional, used to customize sign-in window size
          size: {
            fullscreen: true,
          },
          /**
           * or specify popup width and height
           * size: {
              width: 1000,
              height: 1000,
            }
           */
        },
      }),
  }),
  /* highlight-add-end */
];
```

### The Resolver

Resolvers exist to map the user identity from the 3rd party (in this case Keycloak) to the Backstage user identity.

The default OIDC provider has a choice of built-in resolvers, here is how you configure them:

```yaml title="app-config.yaml"
auth:
  environment: development
  providers:
    oidc:
      development:
        # ...
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

If none of the built-in resolvers are suitable, you can alternatively write a custom resolver.

First, install the OIDC provider module:

```bash
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-oidc-provider
```

Then create a custom resolver as shown below:

```ts title="in packages/backend/src/index.ts"
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
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'keycloak-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.keycloak means that this must be "keycloak".
          providerId: 'keycloak',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createOAuthProviderFactory({
            // For more info about authenticators please see https://backstage.io/docs/auth/add-auth-provider/#adding-an-oauth-based-provider
            authenticator: oidcAuthenticator,
            async signInResolver(info, ctx) {
              const userRef = stringifyEntityRef({
                kind: 'User',
                name: info.result.fullProfile.userinfo.sub,
                namespace: DEFAULT_NAMESPACE,
              });
              return ctx.issueToken({
                claims: {
                  sub: userRef, // The user's own identity
                  ent: [userRef], // A list of identities that the user claims ownership through
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
//...
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-next-line */
backend.add(myAuthProviderModule);
//...
```

For a more detailed explanation about resolvers check the [Identity Resolver][1] page.

### The Configuration

We will now configure our Keycloak-branded OIDC Auth Provider in Backstage, so that it can talk to our Keycloak server.

The first step is to register an OIDC client app for Backstage in your Keycloak server.

Then we need to configure the provider. Based on the provider's code in `plugins/auth-backend/src/providers/oidc/provider.ts` we need the following parameters in the `app-config.yaml`:

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
```

Anything enclosed in `${}` can be replaced directly in the YAML, or provided as environment variables.

#### Required Parameters

These parameters must always be set.

- `clientId`: Grab from the Overview page.
- `clientSecret`: Can only be seen when creating the secret, if you lose it you'll need a
  new secret.
- `metadataUrl`: In Overview > Endpoints tab, grab OpenID Connect metadata document URL.

The OIDC provider **also** requires the `auth.session.secret` to be set.

#### Optional Parameters

These parameters have implicit default values. Don't override them unless you know what you're doing.

- `authorizationUrl` and `tokenUrl`: Open the `metadataUrl` in a browser, that json will
  hold these 2 urls somewhere in there.
- `tokenEndpointAuthMethod`
- `tokenSignedResponseAlg`
- `scope`: Only used if we didn't specify `defaultScopes` in the provider's factory,
  basically the same thing.
- `prompt`: Recommended to use `auto` so the browser will request sign-in to the IDP if the
  user has no active session.
- `sessionDuration`: Lifespan of the user session.
- `startUrlSearchParams`: This is a dictionary of search (query) parameters for the OIDC
  authorization start URL. Don't define it unless you want to change the identity
  provider's behavior. (For example, you could set the `organization` parameter to guide
  users towards a particular sign-in option that your organization prefers.) **Note:** the
  start URL is controlled by the browser, so this feature is only for improving the
  Backstage user experience.

:::note Config Reloading
Backstage does not yet support hot reloading of auth provider configuration. Any changes to this YAML file require a restart of Backstage.
:::

### The Sign-In Page

The last step is to add the provider to the sign-in page, so users can sign in with your new provider.

If you are using the standard Backstage [`SignInPage`][3] component, you can just add it to the `providers` array like this:

```ts title="in packages/app/src/identityProviders.ts"
export const providers = [
  // other providers...
  {
    id: 'keycloak-auth-provider',
    title: 'Keycloak',
    message: 'Sign In using Keycloak',
    apiRef: keycloakAuthApiRef,
  },
];
```

:::note Note
These steps apply to most auth providers. The main
difference between providers will be the contents of the API factory, the code
in the Auth Provider Factory, the resolver, and the different variables each provider
needs in the YAML config or env variables.
:::

[1]: https://backstage.io/docs/auth/identity-resolver
[3]: https://backstage.io/docs/auth/#sign-in-configuration
[4]: https://backstage.io/docs/api/utility-apis
