---
'@backstage/backend-common': patch
---

Plugin developers may now provide handlers for connection errors emitted by cache stores.

```typescript
// Providing an error handler
const cacheClient = somePluginCache.getClient({
  defaultTtl: 3600000,
  onError: e => {
    logger.error(`There was a cache connection problem: ${e.message}`);
    execOtherErrorHandlingLogic();
  },
});
```
