---
'@backstage/plugin-catalog-backend-module-github': patch
---

`GitHubOrgEntityProvider.fromConfig` now supports a `schedule` option like other
entity providers, that makes it more convenient to leverage using the common
task scheduler.

If you want to use this in your own project, it is used something like the following:

```ts
// In packages/backend/src/plugins/catalog.ts
builder.addEntityProvider(
  GitHubOrgEntityProvider.fromConfig(env.config, {
    id: 'production',
    orgUrl: 'https://github.com/backstage',
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { cron: '*/30 * * * *' },
      timeout: { minutes: 10 },
    }),
    logger: env.logger,
  }),
);
```
