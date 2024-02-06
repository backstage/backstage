---
id: index
title: Authentication in Backstage
description: Introduction to authentication in Backstage
---

The authentication system in Backstage serves two distinct purposes: sign-in and
identification of users, as well as delegating access to third-party resources. It is possible to
configure Backstage to have any number of authentication providers, but only
one of these will typically be used for sign-in, with the rest being used to provide
access to external resources.

> NOTE: Identity management and the Sign-In page in Backstage is NOT a method for blocking
> access for unauthorized users. The identity system only serves to provide a personalized
> experience and access to a Backstage Identity Token, which can be passed to backend plugins.
> This also means that your Backstage backend APIs are by default unauthenticated.
> Thus, if your Backstage instance is exposed to the Internet, anyone can access
> information in the Backstage. You can learn more [here](../overview/threat-model.md#integrator-responsibilities).

## Built-in Authentication Providers

Backstage comes with many common authentication providers in the core library:

- [Auth0](auth0/provider.md)
- [Atlassian](atlassian/provider.md)
- [Azure](microsoft/provider.md)
- [Azure Easy Auth](microsoft/azure-easyauth.md)
- [Bitbucket](bitbucket/provider.md)
- [Bitbucket Server](bitbucketServer/provider.md)
- [Cloudflare Access](cloudflare/access.md)
- [GitHub](github/provider.md)
- [GitLab](gitlab/provider.md)
- [Google](google/provider.md)
- [Google IAP](google/gcp-iap-auth.md)
- [Okta](okta/provider.md)
- [OAuth 2 Custom Proxy](oauth2-proxy/provider.md)
- [OneLogin](onelogin/provider.md)
- [VMware Cloud](vmware-cloud/provider.md)

These built-in providers handle the authentication flow for a particular service
including required scopes, callbacks, etc. These providers are each added to a
Backstage app in a similar way.

## Configuring Authentication Providers

Each built-in provider has a configuration block under the `auth` section of
`app-config.yaml`. For example, the GitHub provider:

```yaml
auth:
  environment: development
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
```

See the documentation for a particular provider to see what configuration is
needed.

The `providers` key may have several authentication providers, if multiple
authentication methods are supported. Each provider may also have configuration
for different authentication environments (development, production, etc). This
allows a single auth backend to serve multiple environments, such as running a
local frontend against a deployed backend. The provider configuration matching
the local `auth.environment` setting will be selected.

## Sign-In Configuration

Using an authentication provider for sign-in is something you need to configure
both in the frontend app, as well as the `auth` backend plugin. For information
on how to configure the backend app, see [Sign-in Identities and Resolvers](./identity-resolver.md).
The rest of this section will focus on how to configure sign-in for the frontend app.

Sign-in is configured by providing a custom `SignInPage` app component. It will be
rendered before any other routes in the app and is responsible for providing the
identity of the current user. The `SignInPage` can render any number of pages and
components, or just blank space with logic running in the background. In the end
however it must provide a valid Backstage user identity through the `onSignInSuccess`
callback prop, at which point the rest of the app is rendered.

If you want to, you can use the `SignInPage` component that is provided by `@backstage/core-components`,
which takes either a `provider` or `providers` (array) prop of `SignInProviderConfig` definitions.

The following example for GitHub shows the additions needed to `packages/app/src/App.tsx`,
and can be adapted to any of the built-in providers:

```tsx title="packages/app/src/App.tsx"
/* highlight-add-start */
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
/* highlight-add-end */

const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        provider={{
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        }}
      />
    ),
  },
  /* highlight-add-end */
  // ..
});
```

You can also use the `providers` prop to enable multiple sign-in methods, for example

- allowing guest access:

```tsx title="packages/app/src/App.tsx"
const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        providers={[
          'guest',
          {
            id: 'github-auth-provider',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          },
        ]}
      />
    ),
  },
  /* highlight-add-end */
  // ..
});
```

> NOTE: You can configure sign-in to use a redirect flow with no pop-up by adding
> `enableExperimentalRedirectFlow: true` to the root of your `app-config.yaml`

## Sign-In with Proxy Providers

Some auth providers are so-called "proxy" providers, meaning they're meant to be used
behind an authentication proxy. Examples of these are
[Amazon Application Load Balancer](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/aws-alb-aad-oidc-auth.md),
[Azure EasyAuth](./microsoft/azure-easyauth.md),
[Cloudflare Access](./cloudflare/access.md),
[Google Identity-Aware Proxy](./google/gcp-iap-auth.md)
and [OAuth2 Proxy](./oauth2-proxy/provider.md).

When using a proxy provider, you'll end up wanting to use a different sign-in page, as
there is no need for further user interaction once you've signed in towards the proxy.
All the sign-in page needs to do is to call the `/refresh` endpoint of the auth providers
to get the existing session, which is exactly what the `ProxiedSignInPage` does. The only
thing you need to do to configure the `ProxiedSignInPage` is to pass the ID of the provider like this:

```tsx title="packages/app/src/App.tsx"
const app = createApp({
  components: {
    SignInPage: props => <ProxiedSignInPage {...props} provider="awsalb" />,
  },
  // ..
});
```

If the provider in auth backend expects additional headers such as `x-provider-token`, there is now a way to configure that in `ProxiedSignInPage` using the optional `headers` prop.

Example:

```tsx
<ProxiedSignInPage
  {...props}
  provider="my-custom-provider"
  /* highlight-next-line */
  headers={{ 'x-some-key': someValue }}
/>
```

Headers can also be returned in an async manner:

```tsx
<ProxiedSignInPage
  {...props}
  provider="my-custom-provider"
  /* highlight-start */
  headers={async () => {
    const someValue = await someFn();
    return { 'x-some-key': someValue };
  }}
  /* highlight-end */
/>
```

A downside of this method is that it can be cumbersome to set up for local development.
As a workaround for this, it's possible to dynamically select the sign-in page based on
what environment the app is running in, and then use a different sign-in method for local
development, if one is needed at all. Depending on the exact setup, one might choose to
select the sign-in method based on the `process.env.NODE_ENV` environment variable,
by checking the `hostname` of the current location, or by accessing the configuration API
to read a configuration value. For example:

```tsx title="packages/app/src/App.tsx"
const app = createApp({
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      if (configApi.getString('auth.environment') === 'development') {
        return (
          <SignInPage
            {...props}
            provider={{
              id: 'google-auth-provider',
              title: 'Google',
              message: 'Sign In using Google',
              apiRef: googleAuthApiRef,
            }}
          />
        );
      }
      return <ProxiedSignInPage {...props} provider="gcpiap" />;
    },
  },
  // ..
});
```

When using multiple auth providers like this, it's important that you configure the different
sign-in resolvers so that they resolve to the same identity regardless of the method used.

## Scaffolder Configuration (Software Templates)

If you want to use the authentication capabilities of the [Repository Picker](../features/software-templates/writing-templates.md#the-repository-picker) inside your software templates you will need to configure the [`ScmAuthApi`](https://backstage.io/docs/reference/integration-react.scmauthapi) alongside your authentication provider. It is an API used to authenticate towards different SCM systems in a generic way, based on what resource is being accessed.

To set it up, you'll need to add an API factory entry to `packages/app/src/apis.ts`. The example below sets up the `ScmAuthApi` for an already configured GitLab authentication provider:

```ts title="packages/app/src/apis.ts"
createApiFactory({
  api: scmAuthApiRef,
  deps: {
    gitlabAuthApi: gitlabAuthApiRef,
  },
  factory: ({ gitlabAuthApi }) => ScmAuth.forGitlab(gitlabAuthApi),
});
```

In case you are using a custom authentication providers, you might need to add a [custom `ScmAuthApi` implementation](./index.md#custom-scmauthapi-implementation).

## For Plugin Developers

The Backstage frontend core APIs provide a set of Utility APIs for plugin developers
to use, both to access the user identity, as well as third party resources.

### Identity for Plugin Developers

For plugin developers, there is one main touchpoint for accessing the user identity: the
`IdentityApi` exported by `@backstage/core-plugin-api` via the `identityApiRef`.

The `IdentityApi` gives access to the signed-in user's identity in the frontend.
It provides access to the user's entity reference, lightweight profile information, and
a Backstage token that identifies the user when making authenticated calls within Backstage.

When making calls to backend plugins, we recommend that the `FetchApi` is used, which
is exported via the `fetchApiRef` from `@backstage/core-plugin-api`. The `FetchApi` will
automatically include a Backstage token in the request, meaning there is no need
to interact directly with the `IdentityApi`.

### Accessing Third Party Resources

A common pattern for talking to third party services in Backstage is
user-to-server requests, where short-lived OAuth Access Tokens are requested by
plugins to authenticate calls to external services. These calls can be made
either directly to the services or through a backend plugin or service.

By relying on user-to-server calls we keep the coupling between the frontend and
backend low, and provide a much lower barrier for plugins to make use of third
party services. This is in comparison to for example a session-based system,
where access tokens are stored server-side. Such a solution would require a much
deeper coupling between the auth backend plugin, its session storage, and other
backend plugins or separate services. A goal of Backstage is to make it as easy
as possible to create new plugins, and an auth solution based on user-to-server
OAuth helps in that regard.

The method with which frontend plugins request access to third party services is
through [Utility APIs](../api/utility-apis.md) for each service provider. These
are all suffixed with `*AuthApiRef`, for example `githubAuthApiRef`. For a
full list of providers, see the
[@backstage/core-plugin-api](../reference/core-plugin-api.md#variables) reference.

## Custom Authentication Provider

There are generic authentication providers for OAuth2 and SAML. These can reduce
the amount of code needed to implement a custom authentication provider that
adheres to these standards.

Backstage uses [Passport](http://www.passportjs.org/) under the hood, which has
a wide library of authentication strategies for different providers. See
[Add authentication provider](add-auth-provider.md) for details on adding a new
Passport-supported authentication method.

## Custom ScmAuthApi Implementation

The default `ScmAuthAPi` provides integrations for `github`, `gitlab`, `azure` and `bitbucket` and is created by the following code in `packages/app/src/apis.ts`:

```ts
ScmAuth.createDefaultApiFactory();
```

If you require only a subset of these integrations, then you will need a custom implementation of the [`ScmAuthApi`](https://backstage.io/docs/reference/integration-react.scmauthapi). It is an API used to authenticate different SCM systems generically, based on what resource is being accessed, and is used for example, by the Scaffolder (Software Templates) and Catalog Import plugins.

The first step is to remove the code that creates the default providers.

```ts title="packages/app/src/apis.ts"
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  /* highlight-add-next-line */
  ScmAuth,
} from '@backstage/integration-react';

export const apis: AnyApiFactory[] = [
  /* highlight-add-next-line */
  ScmAuth.createDefaultApiFactory(),
  // ...
];
```

Then replace it with something like this, which will create an `ApiFactory` with only a github provider.

```ts title="packages/app/src/apis.ts"
export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmAuthApiRef,
    deps: {
      githubAuthApi: githubAuthApiRef,
    },
    factory: ({ githubAuthApi }) =>
      ScmAuth.merge(
        ScmAuth.forGithub(githubAuthApi),
      ),
  });
```

If you use any custom authentication integrations, a new provider can be added to the `ApiFactory`.

The first step is to create a new authentication ref, which follows the naming convention of `xxxAuthApiRef`. The example below is for a new GitHub enterprise integration which can be defined either inside the app itself if it's only used for this purpose or inside a common internal package for APIs, such as `@internal/apis`:

```ts
const gheAuthApiRef: ApiRef<OAuthApi & ProfileInfoApi & SessionApi> =
  createApiRef({
    id: 'internal.auth.ghe',
  });
```

This new API ref will only work if you define an API factory for it. For example:

```ts
createApiFactory({
  api: gheAuthApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    oauthRequestApi: oauthRequestApiRef,
    configApi: configApiRef,
  },
  factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
    GithubAuth.create({
      configApi,
      discoveryApi,
      oauthRequestApi,
      provider: { id: 'ghe', title: 'GitHub Enterprise', icon: () => null },
      defaultScopes: ['read:user'],
      environment: configApi.getOptionalString('auth.environment'),
    }),
});
```

The new API ref is then used to add a new provider to the ApiFactory:

```ts
createApiFactory({
  api: scmAuthApiRef,
  deps: {
    gheAuthApi: gheAuthApiRef,
    githubAuthApi: githubAuthApiRef,
  },
  factory: ({ githubAuthApi, gheAuthApi }) =>
    ScmAuth.merge(
      ScmAuth.forGithub(githubAuthApi),
      ScmAuth.forGithub(gheAuthApi, {
        host: 'ghe.example.com',
      }),
    ),
});
```

Finally, you also need to add and configure another provider to the `auth-backend` using the provider ID, which in this example is `ghe`:

```ts
import { providers } from '@backstage/plugin-auth-backend';

// Add the following options to `createRouter` in packages/backend/src/plugins/auth.ts
providerFactories: {
  ghe: providers.github.create(),
},
```

## Configuring token issuers

By default, the Backstage authentication backend generates and manages its own signing keys automatically for any issued
Backstage tokens. However, these keys have a short lifetime and do not persist after instance restarts.

Alternatively, users can provide their own public and private key files to sign issued tokens. This is beneficial in
scenarios where the token verification implementation aggressively caches the list of keys, and doesn't attempt to fetch
new ones even if they encounter an unknown key id. To enable this feature add the following configuration to your config
file:

```yaml
auth:
  keyStore:
    provider: 'static'
    static:
      keys:
        # Must be declared at least once and the first one will be used for signing
        - keyId: 'primary'
          publicKeyFile: /path/to/public.key
          privateKeyFile: /path/to/private.key
          algorithm: # Optional, algorithm used to generate the keys, defaults to ES256
          # More keys can be added so with future key rotations caches already know about it
        - keyId: ...
```

The private key should be stored in the PKCS#8 format. The public key should be stored in the SPKI format.
You can generate the public/private key pair, using openssl and the ES256 algorithm by performing the following
steps:

Generate a private key using the ES256 algorithm

```sh
openssl ecparam -name prime256v1 -genkey -out private.ec.key
```

Convert it to PKCS#8 format

```sh
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private.ec.key -out private.key
```

Extract the public key

```sh
openssl ec -inform PEM -outform PEM -pubout -in private.key -out public.key
```
