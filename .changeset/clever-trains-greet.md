---
'@backstage/plugin-tech-insights-backend': minor
---

**BREAKING**: The `buildTechInsightsContext` function now takes an additional
field in its options argument: `tokenManager`. This is an instance of
`TokenManager`, which can be found in your backend initialization code's
`env`.

```diff
 const builder = buildTechInsightsContext({
   logger: env.logger,
   config: env.config,
   database: env.database,
   discovery: env.discovery,
   scheduler: env.scheduler,
+  tokenManager: env.tokenManager,
   factRetrievers: [ /* ... */ ],
 });
```
