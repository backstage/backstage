---
'@backstage/plugin-proxy-backend': patch
---

The proxy-backend plugin now supports reviving request bodies that have previously been consumed by an express middleware (e.g. `express.json()`). This is done by setting `reviveConsumedRequestBodies: true` on the proxy `RouterOptions`. In order to preserve the current behavior, the proxy will **not** revive request bodies by default.

The following is an example of a proxy `createRouter` invocation that revives request bodies:

```diff
const router = await createRouter({
  config,
  logger,
  discovery,
+ reviveConsumedRequestBodies: true,
});
```
