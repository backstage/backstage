---
'@backstage/plugin-catalog-import': minor
---

Switched to using the `ScmAuthApi` for authentication rather than GitHub auth. If you are instantiating your `CatalogImportClient` manually you now need to pass in an instance of `ScmAuthApi` instead.

Also be sure to register the `scmAuthApiRef` from the `@backstage/integration-react` in your app:

```ts
import { ScmAuth } from '@backstage/integration-react';

// in packages/app/apis.ts

const apis = [
// ... other APIs

ScmAuth.createDefaultApiFactory();

// OR

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
]
```
