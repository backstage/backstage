---
'@backstage/plugin-catalog-backend-module-github': patch
---

Github Entity Provider functionality for adding entities to the catalog.

This provider replaces the GithubDiscoveryProcessor functionality as providers offer more flexibility with scheduling ingestion, removing and preventing orphaned entities.

Implementation example inside `catalog.ts`

```
  import { GitHubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
  ...
  const config = env.config;
  const logger = env.logger;
  const integrations = ScmIntegrations.fromConfig(config);
  const githubCredentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);

  builder.addEntityProvider(GitHubEntityProvider.fromConfig(env.config, {
    githubCredentialsProvider,
    logger,
    id: 'development',
    target: 'https://github.com/test-repo/*/blob/-/catalog-info.yaml',
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 20 },
      timeout: { minutes: 30 },
    })
  }))
```
