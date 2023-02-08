---
'@backstage/plugin-proxy-backend': minor
---

The proxy-backend plugin now supports reviving request bodies that have previously been consumed by an express middleware (e.g. `express.json()`). This is done by setting `reviveRequestBody: true` on the proxy configuration. In order to preserve the current behavior, the proxy will **not** revive request bodies by default.

The following is an example of a proxy configuration that revives request bodies:

```diff
proxy:
  '/target':
    target: 'http://proxy-route'
+   reviveRequestBody: true
```
