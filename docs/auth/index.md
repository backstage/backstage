---
id: index
title: Adding Authentication
description: How to add authentication to a Backstage application
---

Authentication in Backstage identifies the user, and provides a way for plugins
to make requests on behalf of a user to third-party services. Backstage can have
zero (guest access), one, or many authentication providers. The default
`@backstage/create-app` template uses guest access for easy startup.

See [Using authentication and identity](using-auth.md) for tips on using
Backstage identity information in your app or plugins.

## Adding an authentication provider

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

### Adding provider configuration

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

## Using an authentication provider for sign-in

If you want to use an authentication provider for sign-in, as opposed to just accessing external resources, you'll need to configure that in your app as well. This is done by providing a custom `SignInPage` component to the app, which will require the user to sign in before they can access the app. Note that this does not block access to the app, which you can read more about [here](./using-auth.md).

If you want to, you can use the `SignInPage` component that is provided by `@backstage/core-components`, which takes either a `provider` or `providers` (array) prop of `SignInProviderConfig` definitions. These reference the `ApiRef` exported for the provider.

Again, the following example for GitHub shows the additions needed to `packages/app/src/App.tsx`, and can be adapted to any of the built-in providers:

```diff
+ import { githubAuthApiRef } from '@backstage/core-plugin-api';
+ import { SignInProviderConfig, SignInPage } from '@backstage/core-components';

+ const githubProvider: SignInProviderConfig = {
+  id: 'github-auth-provider',
+  title: 'GitHub',
+  message: 'Sign in using GitHub',
+  apiRef: githubAuthApiRef,
+};
+
 const app = createApp({
   apis,
+  components: {
+    SignInPage: props => (
+      <SignInPage
+        {...props}
+        auto
+        provider={githubProvider}
+      />
+    ),
+  },
   bindRoutes({ bind }) {
```

To also allow unauthenticated guest access, use the `providers` prop for
`SignInPage`:

```diff
 const app = createApp({
   apis,
+  components: {
+    SignInPage: props => (
+      <SignInPage
+        {...props}
+        providers={['guest', githubProvider]}
+      />
+    ),
+  },
   bindRoutes({ bind }) {
```

## Adding a custom authentication provider

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
