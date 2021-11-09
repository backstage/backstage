---
'@backstage/techdocs-common': patch
---

1. Techdocs publisher constructors now use parameter objects when being
   instantiated

2. Internal refactor of `LocalPublish` publisher to use `fromConfig` for
   creation to be aligned with other publishers; this does not impact
   `LocalPublish` usage.

```diff
- const publisher = new LocalPublish(config, logger, discovery);
+ const publisher = LocalPublish.fromConfig(config, logger, discovery);
```
