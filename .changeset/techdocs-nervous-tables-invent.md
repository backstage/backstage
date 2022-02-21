---
'@backstage/plugin-techdocs-backend': minor
---

BREAKING: constructor based initialization of DefaultTechDocsCollator now deprecated. Use static fromConfig method instead.

```diff
indexBuilder.addCollator({
  defaultRefreshIntervalSeconds: 600,
-   collator: new DefaultTechDocsCollator({
+   collator: DefaultTechDocsCollator.fromConfig(config, {
    discovery,
    logger,
    tokenManager,
  }),
});
```

Note: in an upcoming release, TechDocs backend's /sync/:namespace/:kind/:name endpoint will only respond to text/event-stream-based requests. Update any custom code at your organization accordingly.
