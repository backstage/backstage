---
'@backstage/create-app': patch
---

Added the default `ScmAuth` implementation to the app.

To apply this change to an existing app, head to `packages/app/apis.ts`, import `ScmAuth` from `@backstage/integration-react`, and add a `ScmAuth.createDefaultApiFactory()` to your list of APIs:

```diff
 import {
   ScmIntegrationsApi,
   scmIntegrationsApiRef,
+   ScmAuth,
 } from '@backstage/integration-react';

 export const apis: AnyApiFactory[] = [
...
+  ScmAuth.createDefaultApiFactory(),
...
 ];
```

If you have integrations towards SCM providers other than the default ones (github.com, gitlab.com, etc.), you will want to create a custom `ScmAuth` factory instead, for example like this:

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
