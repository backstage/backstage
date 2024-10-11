---
'@backstage/backend-defaults': patch
---

The default root HTTP service implementation will now pretty-print JSON responses in development.

If you are overriding the `rootHttpRouterServiceFactory` with a `configure` function that doesn't call `applyDefaults`, you can introduce this functionality by adding the following snippet inside `configure`:

```ts
if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
}
```
