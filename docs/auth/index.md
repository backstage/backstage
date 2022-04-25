---
id: index
title: Authentication in Backstage
description: Introduction to authentication in Backstage
---

The authentication system in Backstage serves two distinct purposes: sign-in and
identification of users, as well as delegating access to third-party resources. It is possible to
configure Backstage to have any number of authentication providers, but only
one of these will typically be used for sign-in, with the rest being used to provide
access external resources.

## Built-in Authentication Providers

Backstage comes with many common authentication providers in the core library:

- [Atlassian](atlassian/provider.md)
- [Auth0](auth0/provider.md)
- [Azure](microsoft/provider.md)
- [Bitbucket](bitbucket/provider.md)
- [GitHub](github/provider.md)
- [GitLab](gitlab/provider.md)
- [Google](google/provider.md)
- [Okta](okta/provider.md)
- [OneLogin](onelogin/provider.md)
- [OAuth2Proxy](oauth2-proxy/provider.md)

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

> NOTE: Identity management and the `SignInPage` in Backstage is NOT a method
> for blocking access for unauthorized users, that either requires additional
> backend implementation or a separate service like Google's Identity-Aware
> Proxy. The identity system only serves to provide a personalized experience
> and access to a Backstage Identity Token, which can be passed to backend
> plugins.

Using an authentication provide for sign-in is something you need to configure
both in the frontend app, as well as the `auth` backend plugin. For information
on how to configure the backend app, see [Sign-in Identities and Resolvers](./identity-resolver.md).
The rest of this section will focus on how to configure sign-in for the frontend app.

Sign-in is configured by providing a custom `SignInPage` app component. It will
rendered before any other routes in the app and is responsible for providing the
identity of the current user. The `SignInPage` can render any number of pages and
components, or just blank space with logic running in the background. In the end
however it must provide a valid Backstage user identity through the `onSignInSuccess`
callback prop, at which point the rest of the app is rendered.

If you want to, you can use the `SignInPage` component that is provided by `@backstage/core-components`,
which takes either a `provider` or `providers` (array) prop of `SignInProviderConfig` definitions.

The following example for GitHub shows the additions needed to `packages/app/src/App.tsx`,
and can be adapted to any of the built-in providers:

```diff
+ import { githubAuthApiRef } from '@backstage/core-plugin-api';
+ import { SignInPage } from '@backstage/core-components';

 const app = createApp({
   apis,
+  components: {
+    SignInPage: props => (
+      <SignInPage
+        {...props}
+        auto
+        provider={{
+          id: 'github-auth-provider',
+          title: 'GitHub',
+          message: 'Sign in using GitHub',
+          apiRef: githubAuthApiRef,
+        }}
+      />
+    ),
+  },
   bindRoutes({ bind }) {
```

You can also use the `providers` prop to enable multiple sign-in methods, for example
allows allowing guest access:

```diff
 const app = createApp({
   apis,
+  components: {
+    SignInPage: props => (
+      <SignInPage
+        {...props}
+        providers={['guest', {
+          id: 'github-auth-provider',
+          title: 'GitHub',
+          message: 'Sign in using GitHub',
+          apiRef: githubAuthApiRef,
+        }]}
+      />
+    ),
+  },
   bindRoutes({ bind }) {
```

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

If you are using any custom authentication providers, like for example one for GitHub Enterprise, then you are likely to need a custom implementation of the [`ScmAuthApi`](https://backstage.io/docs/reference/integration-react.scmauthapi). It is an API used to authenticate towards different SCM systems in a generic way, based on what resource is being accessed, and is used for example by the Scaffolder (Software Templates) and Catalog Import plugins.

To set up a custom `ScmAuthApi` implementation, you'll need to add an API factory entry to `packages/app/src/apis.ts`. The following example shows an implementation that supports both public GitHub via `githubAuthApi` as well as a GitHub Enterprise installation hosted at `ghe.example.com` via `gheAuthApi`:

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
