---
'@backstage/plugin-search-backend-module-explore': patch
---

Allows for an optional `tokenManager` to authenticate requests from the collator to the explore backend. For example:

```diff
  indexBuilder.addCollator({
    schedule: every10MinutesSchedule,
    factory: ToolDocumentCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      logger: env.logger,
    + tokenManager: env.tokenManager,
    }),
  });
```