---
'@backstage/plugin-proxy-backend': patch
---

Adds a new option `skipInvalidTargets` for the proxy `createRouter` which allows the proxy backend to be started with an invalid proxy configuration. If configured, it will simply skip the failed proxy and mount the other valid proxies.

To configure it to pass by failing proxies:

```
const router = await createRouter({
  config,
  logger,
  discovery,
  skipInvalidProxies: true,
});
```

If you would like it to fail if a proxy is configured badly:

```
const router = await createRouter({
  config,
  logger,
  discovery,
});
```
