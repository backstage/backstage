---
id: oidc
title: OIDC provider from scratch
description: This section shows how to use an OIDC provider from scrath, same steps apply for custom providers.
---

This section shows how to use an OIDC provider from scratch, same steps apply for custom
providers. Please note these steps are for using a provider, not how to implement one.

## Summary

To add providers not enabled by default like OIDC, we need to follow some steps, we
assume you already have a sign in page to which we'll add the provider so users can
sign in through the provider. In simple steps here's how you enable the provider:

- Create an API reference to identify the provider.
- Create the API factory that will handle the authentication.
- Add a resolver so you can handle the result from the authentication.
- Configure the provider to access your 3rd party auth solution.
- Add the provider to sign in page so users can login with it.

We'll explain each step more in detail next.

### The API reference

An API reference exist for the sake of **Dependency Injection**, it's basically an ID to
help backstage DI to identify the provider and either create a new instance of the
class/object/API identified by such ID, or if it has already been created, return the
existing instance, that way we have a singleton instance of the provider.

In this OIDC example, we'll create the API reference directly in the
`packages/app/src/apis.ts` file, it is not a requirement to put the reference in this
file. Any location will do as long as it's available to be imported to where the API
factory is, as well as easily accessible to the rest of the application so any package
and plugin can inject the API instance when necessary.

An example of such would be when you use an auth provider from a library installed with
NPM, or any other library repository, you would import the API ref from the library.

```ts
export const oidcAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'core.auth.oidc',
});
```

Please note a few things, the ID can be anything you want as long as it doesn't conflict
with other refs, also we're exporting this reference, as well as the `typings`, we need to
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
APIs and use them to create an instance of an OIDC provider.

Please note that this function only runs (creates the instance) when somewhere else in
the app you request the DI to give you an instance of the OIDC provider using the API ref
defined above, and the DI will only run this function the first time, from then on any
other DI injection will just receive the same instance created the first time, basically
the instance is cached by the DI library, a singleton.

Let's add our OIDC factory to the APIs array in the `packages/app/src/apis.ts` file:

```diff
+ import { OAuth2 } from '@backstage/core-app-api';

export const apis: AnyApiFactory[] = [
+   createApiFactory({
+    api: oidcAuthApiRef,
+    deps: {
+      discoveryApi: discoveryApiRef,
+      oauthRequestApi: oauthRequestApiRef,
+      configApi: configApiRef,
+    },
+    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
+      OAuth2.create({
+        discoveryApi,
+        oauthRequestApi,
+        provider: {
+          id: 'oidc',
+          title: 'OIDC provider',
+          icon: () => null,
+        },
+        environment: configApi.getOptionalString('auth.environment'),
+        defaultScopes: [
+          'openid',
+          'profile',
+          'email',
+        ],
+      }),
+  }),

```

Please note we're importing the `OAuth2` class from `@backstage/core-app-api` effectively
delegating the authentication to it (yes it can handle OIDC as well). Also we're using
the `oidc` ID to tell `OAuth2` to use the OIDC protocol, and added the default scopes to
request ID, profile, email and user read permissions.

### The Resolver

Resolvers exist to map user identity from the 3rd party (in this case OIDC provider) to
the backstage user identity, for a detailed explanation check the [Identity Resolver][1]
page, it explains how to write a custom resolver as well as linking the built in resolvers
of backstage.

As an example if you're setting up OIDC provider with Microsoft, you could use the built
in Microsoft resolvers, or create one yourself in `packages/backend/src/plugins/auth.ts`:

```diff
import {
  DEFAULT_NAMESPACE,
+ stringifyEntityRef,
} from '@backstage/catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,
+     // oidc: providers.oidc.create({
+     //   signIn: {
+     //     resolver:
+     //       providers.microsoft.resolvers.emailMatchingUserEntityAnnotation() as any,
+     //   },
+     // }),
+     oidc: providers.oidc.create({
+       signIn: {
+         resolver(info, ctx) {
+           const userRef = stringifyEntityRef({
+             kind: 'User',
+             name: info.profile.email!,
+             namespace: DEFAULT_NAMESPACE,
+           });
+           console.log(info, userRef);
+           return ctx.issueToken({
+             claims: {
+               sub: userRef, // The user's own identity
+               ent: [userRef], // A list of identities that the user claims ownership through
+             },
+           });
+         },
+       },
+     }),
    }
```

### The configuration

We are using the `OAuth2` wrapper to delegate the authentication to the 3rd party using
the OIDC protocol, as such, it depends on the specific wrapper what has to be configured.

As an example we'll configure OIDC with Microsoft, to do so we need to
[Create app registration][2] in the Azure console, the only difference is that the
`http://localhost:7007/api/auth/microsoft/handler/frame` URL needs to change to
`http://localhost:7007/api/auth/oidc/handler/frame`.

Then we need to configure the env variables for the provider, based on the provider's code
in `plugins/auth-backend/src/providers/oidc/provider.ts` we need the following variables
in the `app-config.yaml`:

```yaml
auth:
  environment: development
  ### Providing an auth.session.secret will enable session support in the auth-backend
  session:
    secret: ${SESSION_SECRET}
  providers:
    oidc:
      # Note that you must define a session secret (see above) since the oidc provider requires session support.
      # Note that by default, this provider will use the 'none' prompt which assumes that your are already logged on in the IDP.
      # You should set prompt to:
      # - auto: will let the IDP decide if you need to log on or if you can skip login when you have an active SSO session
      # - login: will force the IDP to always present a login form to the user
      development:
        metadataUrl: ${AUTH_OIDC_METADATA_URL}
        clientId: ${AUTH_OIDC_CLIENT_ID}
        clientSecret: ${AUTH_OIDC_CLIENT_SECRET}
        authorizationUrl: ${AUTH_OIDC_AUTH_URL}
        tokenUrl: ${AUTH_OIDC_TOKEN_URL}
        tokenSignedResponseAlg: ${AUTH_OIDC_TOKEN_SIGNED_RESPONSE_ALG} # default='RS256'
        scope: ${AUTH_OIDC_SCOPE} # default='openid profile email'
        prompt: ${AUTH_OIDC_PROMPT} # default=none (allowed values: auto, none, consent, login)
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
- `tokenSignedResponseAlg`: Don't define it, use the default unless you know what it does.
- `scope`: Only used if we didn't specify `defaultScopes` in the provider's factory,
  basically the same thing.
- `prompt`: Recommended to use `auto` so the browser will request login to the IDP if the
  user has no active session.

Note that for the time being, any change in this yaml file requires a restart of the app.

### The Sign In provider

The last step is to add the provider to the `SignInPage` so users can sign in with your
new provider, please follow the [Sing In Configuration][3] docs, here's where you import
and use the API ref we defined earlier.

## Note

These steps apply to most if not all the providers, including custom providers, the main
difference between different providers will be the contents of the factory, the code in
the resolver, and the different variables each provider needs in the YAML config or env
variables.

[1]: https://backstage.io/docs/auth/identity-resolver
[2]: https://backstage.io/docs/auth/microsoft/provider#create-an-app-registration-on-azure
[3]: https://backstage.io/docs/auth/#sign-in-configuration
