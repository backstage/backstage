---
id: oidc
title: OIDC provider from scratch
description: This section shows how to use an OIDC provider from scratch, same steps apply for custom providers.
---

:::info
This documentation is written for [the new backend system](../backend-system/index.md) which is the default since Backstage
[version 1.24](../releases/v1.24.0.md). If you are still on the old backend
system, you may want to read [its own article](./oidc--old.md)
instead, and [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

This section shows how to use an OIDC provider from scratch, same steps apply for custom
providers. Please note these steps are for using a provider, not how to implement one,
and Backstage recommends creating custom providers specific to the IDP, so we'll use a
`azureOIDC` provider throughout this example, feel free to change any of those refs
to your provider name.

## Summary

To add providers not enabled by default like OIDC, we need to follow some steps, we
assume you already have a sign-in page to which we'll add the provider so users can
sign in through the provider. In simple steps here's how you enable the provider:

- Create an API reference to identify the provider.
- Create the API factory that will handle the authentication.
- Add or reuse an auth provider so you can authenticate.
- Add or reuse a resolver to handle the result from the authentication.
- Configure the provider to access your 3rd party auth solution.
- Add the provider to sign in page so users can login with it.

We'll explain each step more in detail next.

### The API reference

An API reference exist for the sake of **Dependency Injection**, check [Utility APIs][4]
for extended explanation.

In this OIDC example, we'll create the API reference directly in the
`packages/app/src/apis.ts` file, it is not a requirement to put the reference in this
file. Any location will do as long as it's available to be imported to where the API
factory is, as well as easily accessible to the rest of the application so any package
and plugin can inject the API instance when necessary.

An example of such would be when you use an auth provider from a library installed with
NPM, or any other library repository, you would import the API ref from the library.

```ts
export const azureOIDCAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'auth.my-custom-provider',
});
```

Please note a few things, the ID can be anything you want as long as it doesn't conflict
with other refs, backstage recommends to use a custom name that references your custom
provider, for example we are using OIDC protocol with Azure, so we could use something
like `auth.azure.oidc` as well.

Also we're exporting this reference, as well as the `typings`, we need to
be able to import this reference anywhere in the app, and the `typings` will tell typescript
what instance we're getting from DI when injecting the API. In this case we are defining
an API for authentication, so we tell TS that this instance complies with 4 API
interfaces:

- The OICD API that will handle authentication.
- Profile API for requesting user profile info from the auth provider in question.
- Backstage identity API to handle and associate the user profile with backstage identity.
- Session API, to handle the session the user will have while logged in.

### The API Factory

A factory is a function that can take some parameters or dependencies and return an
instance of something, in our case it will be a function that requests some backstage
APIs and use them to create an instance of an OIDC API provider.

Please note that this function only runs (creates the instance) when somewhere else in
the app you request the DI to give you an instance of the OIDC provider using the API ref
defined above, and the DI will only run this function the first time, from then on any
other DI injection will just receive the same instance created the first time, basically
the instance is cached by the DI library, a singleton.

Let's add our OIDC API factory to the APIs array in the `packages/app/src/apis.ts` file:

```ts title="packages/app/src/apis.ts"
/* highlight-add-next-line */
import { OAuth2 } from '@backstage/core-app-api';

export const apis: AnyApiFactory[] = [
  /* highlight-add-start */
  createApiFactory({
    api: azureOIDCAuthApiRef,
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
        provider: {
          id: 'my-auth-provider',
          title: 'My custom auth provider',
          icon: () => null,
        },
        environment: configApi.getOptionalString('auth.environment'),
        defaultScopes: ['openid', 'profile', 'email'],
        popupOptions: {
          // optional, used to customize login in popup size
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
  // ..
];
```

Please note we're importing the `OAuth2` class from `@backstage/core-app-api` effectively
delegating the authentication to it. Also we're using the `my-auth-provider` ID to tell
`OAuth2` to use the auth provider we'll define in the next section, and added the default
scopes to request ID, profile, email and user read permissions.

## The Auth Provider

The Auth Provider is responsible for authenticating with the 3rd party service, and give
us back the credentials, here's where you pick which protocol to use, be it Auth0, OAuth2,
OIDC, SAML or any other that your 3rd party IDP provider supports.

### The Resolver

Resolvers exist to map user identity from the 3rd party (in this case an azure IDP
provider) to the backstage user identity.

The default OIDC provider has built-in resolvers, here is how you configure them:

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

But you can also write a custom resolver as well, see an example below:

```ts title="in packages/backend/src/index.ts"
/* highlight-add-start */
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';

const myAuthProviderModule = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'my-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.azure means that this must be "azure".
          providerId: 'my-auth-provider',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createOAuthProviderFactory({
            // For more info about authenticators please see https://backstage.io/docs/auth/add-auth-provider/#adding-an-oauth-based-provider
            authenticator: oidcAuthenticator,
            async signInResolver(info, ctx) {
              const userRef = stringifyEntityRef({
                kind: 'User',
                name: info.result.userinfo.sub,
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

For a more a detailed explanation about resolvers check the
[Identity Resolver][1] page.

### The configuration

Since we are using our custom OIDC Auth Provider, we need to add a configuration based
on the provider used, in this case based on OIDC protocol (remember the 3rd party has to
support the protocol).

In this example we'll configure OIDC with `my-auth-provider`, to do so we need to
[Create app registration][2] in the Azure console, the only difference is that the
`http://localhost:7007/api/auth/microsoft/handler/frame` URL needs to change to
`http://localhost:7007/api/auth/my-auth-provider/handler/frame`.

Then we need to configure the env variables for the provider, based on the provider's code
in `plugins/auth-backend/src/providers/oidc/provider.ts` we need the following variables
in the `app-config.yaml`:

```yaml title="app-config.yaml"
auth:
  environment: development
  ### Providing an auth.session.secret will enable session support in the auth-backend
  session:
    secret: ${SESSION_SECRET}
  providers:
    my-auth-provider:
      development:
        metadataUrl: https://example.com/.well-known/openid-configuration
        clientId: ${AUTH_MY_CLIENT_ID}
        clientSecret: ${AUTH_MY_CLIENT_SECRET}
```

Anything enclosed in `${}` can be replaced directly in the yaml, or provided as
environment variables, the way you obtain all these except `scope` and `prompt` is to
check the App Registration you created:

- `clientId`: Grab from the Overview page.
- `clientSecret`: Can only be seen when creating the secret, if you lose it you'll need a
  new secret.
- `metadataUrl`: In Overview > Endpoints tab, grab OpenID Connect metadata document URL.
- `authorizationUrl` and `tokenUrl`: Open the `metadataUrl` in a browser, that json will
  hold these 2 urls somewhere in there.
- `tokenEndpointAuthMethod`: Don't define it, use the default unless you know what it does.
- `tokenSignedResponseAlg`: Don't define it, use the default unless you know what it does.
- `scope`: Only used if we didn't specify `defaultScopes` in the provider's factory,
  basically the same thing.
- `prompt`: Recommended to use `auto` so the browser will request login to the IDP if the
  user has no active session.
- `sessionDuration` (optional): Lifespan of the user session.

Note that for the time being, any change in this yaml file requires a restart of the app,
also you need to have the `session.secret` part to use OIDC (some other providers might
need this as well) to support user sessions.

### The Sign In provider

The last step is to add the provider to the `SignInPage` so users can sign in with your
new provider, please follow the [Sign In Configuration][3] docs, here's where you import
and use the API reference we defined earlier.

:::note Note

These steps apply to most if not all the providers, including custom providers, the main
difference between different providers will be the contents of the API factory, the code
in the Auth Provider Factory, the resolver, and the different variables each provider
needs in the YAML config or env variables.

:::

[1]: https://backstage.io/docs/auth/identity-resolver
[2]: https://backstage.io/docs/auth/microsoft/provider#create-an-app-registration-on-azure
[3]: https://backstage.io/docs/auth/#sign-in-configuration
[4]: https://backstage.io/docs/api/utility-apis
