---
'@backstage/frontend-test-utils': patch
---

Added `mountedRoutes` option to `renderTestApp` for binding route refs to paths, matching the existing option in `renderInTestApp`:

```typescript
renderTestApp({
  extensions: [...],
  mountedRoutes: {
    '/my-path': myRouteRef,
  },
});
```
