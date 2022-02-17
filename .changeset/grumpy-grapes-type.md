---
'@backstage/plugin-catalog-backend': patch
---

Deprecated the second parameter of `results.location()` that determines whether an emitted location is optional. In cases where this is currently being set to `false`, the parameter can simply be dropped, as that is the default. Usage where this was being set to `true` should be migrated to set the `presence` option of the emitted location to `optional`. For example:

```ts
results.location(
  {
    type: 'url',
    target: 'http://example.com/foo',
  },
  true,
);

// migrated to

results.location({
  type: 'url',
  target: 'http://example.com/foo',
  presence: 'optional',
});
```
