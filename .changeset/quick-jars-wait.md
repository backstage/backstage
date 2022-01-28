---
'@backstage/plugin-proxy-backend': patch
---

If one of the configured proxies is configured badly enough to cause an exception when the middleware is being built it will now pass by it and continue the server startup. Previously the backend would fail to startup.
