---
'@backstage/plugin-proxy-backend': patch
---

If one of the configured proxies is configured badly enough to cause an exception when the middleware is being built it can now be configured to pass the bad proxy by and continue the server startup. Previously the backend would fail to startup.

To configure it to pass by failing proxies:

```
const router = await createRouter({
  config,
  logger,
  discovery,
  skipBrokenProxies: true,
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
