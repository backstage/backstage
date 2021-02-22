---
'@backstage/plugin-explore': minor
---

Introduce external route for linking to the entity page from the explore plugin.

To use the explore plugin you have to bind the external route in your app:

```typescript
const app = createApp({
  ...
  bindRoutes({ bind }) {
    ...
    bind(explorePlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
  },
});
```
