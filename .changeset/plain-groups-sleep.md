---
'@backstage/backend-defaults': patch
---

Added an optional `backend.trustProxy` app config value, which sets the
corresponding [Express.js `trust proxy`](https://expressjs.com/en/guide/behind-proxies.html) setting. This lets
you easily configure proxy trust without making a custom `configure` callback
for the `rootHttpRouter` service.

If you already are using a custom `configure` callback, and if that also _does not_ call `applyDefaults()`, you may want to add the following to it:

```ts
const trustProxy = config.getOptional('backend.trustProxy');
if (trustProxy !== undefined) {
  app.set('trust proxy', trustProxy);
}
```
