---
'@backstage/plugin-catalog-backend-module-github': minor
---

BREAKING: Support authenticated backends by including a server token for catalog requests. The constructor of `GithubLocationAnalyzer` now requires an instance of `TokenManager` to be supplied:

```diff
...
  builder.addLocationAnalyzers(
    new GitHubLocationAnalyzer({
      discovery: env.discovery,
      config: env.config,
+     tokenManager: env.tokenManager,
    }),
  );
...
```
