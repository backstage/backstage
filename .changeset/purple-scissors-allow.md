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
