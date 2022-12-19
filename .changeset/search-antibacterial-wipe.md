---
'@backstage/plugin-search-backend-module-pg': minor
---

Added the option to pass a logger to `PgSearchEngine` during instantiation. You may do so as follows:

```diff
const searchEngine = await PgSearchEngine.fromConfig(env.config, {
  database: env.database,
+ logger: env.logger,
});
```
