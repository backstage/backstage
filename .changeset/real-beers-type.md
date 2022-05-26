---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

do not create location object if file with component definition do not exists in project, that decrease count of request to gitlab with 404 status code. Now we can create processor with new flag to enable this logic:

```ts
const processor = GitLabDiscoveryProcessor.fromConfig(config, {
  logger,
  skipReposWithoutExactFileMatch: true,
});
```

**WARNING:** This new functionality does not support globs in the repo file path
