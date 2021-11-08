---
'@backstage/techdocs-common': patch
---

1. Techdocs publishers constructors now use parameter objects when being instantiated

2. The `LocalPublish` publisher can now be created using `fromConfig`:

```diff
- const publisher = new LocalPublish(config, logger, discovery);
+ const publisher = LocalPublish.fromConfig(config, logger, discovery);
```
