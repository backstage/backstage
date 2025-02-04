---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

The `getOctokitOptions` function signature with `repoUrl` option has been deprecated in favour of a function signature with individual `host`, `owner`, and `repo` parameters:

```diff
  const octokitOptions = await getOctokitOptions({
    integrations,
    credentialsProvider,
    token,
-   repoUrl,
+   host,
+   owner,
+   repo,
  });
```
