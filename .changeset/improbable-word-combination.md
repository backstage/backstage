---
'@backstage/backend-common': patch
---

All cache-related connection errors are now handled and logged by the cache manager. App Integrators may provide an optional error handler when instantiating the cache manager if custom error handling is needed.

```typescript
// Providing an error handler
const cacheManager = CacheManager.fromConfig(config, {
  onError: e => {
    if (isSomehowUnrecoverable(e)) {
      gracefullyShutThingsDown();
      process.exit(1);
    }
  },
});
```
