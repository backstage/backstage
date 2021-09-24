---
'@backstage/integration-react': patch
---

Added `ScmAuthApi` along with the implementation `ScmAuth`. The `ScmAuthApi` provides methods for client-side authentication towards multiple different source code management services simultaneously.

When requesting credentials you supply a URL along with the same options as the other `OAuthApi`s, and optionally a request for additional high-level scopes.

For example like this:

```ts
const { token } = await scmAuthApi.getCredentials({
  url: 'https://ghe.example.com/backstage/backstage',
  additionalScope: {
    repoWrite: true,
  },
});
```

The instantiation of the API can either be done with a default factory that adds support for the public providers (github.com, gitlab.com, etc.):

```ts
// in packages/app/apis.ts
ScmAuth.createDefaultApiFactory();
```

Or with a more custom setup that can add support for additional providers, for example like this:

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

The additional `gheAuthApiRef` utility API can be defined either inside the app itself if it's only used for this purpose, for inside an internal common package for APIs, such as `@internal/apis`:

```ts
const gheAuthApiRef: ApiRef<OAuthApi & ProfileInfoApi & SessionApi> =
  createApiRef({
    id: 'internal.auth.ghe',
  });
```

And then implemented using the `GithubAuth` class from `@backstage/core-app-api`:

```ts
createApiFactory({
  api: githubAuthApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    oauthRequestApi: oauthRequestApiRef,
    configApi: configApiRef,
  },
  factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
    GithubAuth.create({
      provider: {
        id: 'ghe',
        icon: ...,
        title: 'GHE'
      },
      discoveryApi,
      oauthRequestApi,
      defaultScopes: ['read:user'],
      environment: configApi.getOptionalString('auth.environment'),
    }),
})
```

Finally you also need to add and configure another GitHub provider to the `auth-backend` using the provider ID `ghe`:

```ts
// Add the following options to `createRouter` in packages/backend/src/plugins/auth.ts
providerFactories: {
  ghe: createGithubProvider(),
},
```

Other providers follow the same steps, but you will want to use the appropriate auth API implementation in the frontend, such as for example `GitlabAuth`.
