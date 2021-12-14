---
'@backstage/plugin-catalog': patch
---

Deprecated the `CatalogClientWrapper` class.

The default implementation of `catalogApiRef` that this plugin exposes, is now powered by the new `fetchApiRef`. The default implementation of _that_ API, in turn, has the ability to inject the user's Backstage token in requests in a similar manner to what the deprecated `CatalogClientWrapper` used to do. The latter has therefore been taken out of the default catalog API implementation.

If you use a custom `fetchApiRef` implementation that does NOT issue tokens, or use a custom `catalogApiRef` implementation which does NOT use the default `fetchApiRef`, you can still for some time wrap your catalog API in this class to get back the old behavior:

```ts
// Add this to your packages/app/src/plugins.ts if you want to get back the old
// catalog client behavior:
createApiFactory({
  api: catalogApiRef,
  deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
  factory: ({ discoveryApi, identityApi }) =>
    new CatalogClientWrapper({
      client: new CatalogClient({ discoveryApi }),
      identityApi,
    }),
}),
```

But do consider migrating to making use of the `fetchApiRef` as soon as convenient, since the wrapper class will be removed in a future release.
