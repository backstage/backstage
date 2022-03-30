---
'@backstage/plugin-tech-insights-backend': minor
---

This backend now uses the `@backstage/backend-tasks` package facilities for scheduling fact retrievers.

**BREAKING**: The `buildTechInsightsContext` function now takes an additional field in its options argument: `scheduler`. This is an instance of `PluginTaskScheduler`, which can be found in your backend initialization code's `env`.

```diff
 const builder = buildTechInsightsContext({
   logger: env.logger,
   config: env.config,
   database: env.database,
   discovery: env.discovery,
+  scheduler: env.scheduler,
   factRetrievers: [ /* ... */ ],
 });
```
