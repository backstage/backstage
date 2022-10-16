---
'@backstage/plugin-catalog-import': minor
---

**Breaking**
Moved the code search for the existing catalog-info.yaml files to the backend from the frontend. It means it will use the configured GitHub integration's credentials.

Add the following to your `CatalogBuilder` to have the repo URL ingestion working again.

```ts
// catalog.ts
import { GitHubLocationAnalyzer } from '@backstage/plugin-catalog-backend-module-github';
...
  builder.addLocationAnalyzers(
    new GitHubLocationAnalyzer({
      discovery: env.discovery,
      config: env.config,
    }),
  );
...
```
