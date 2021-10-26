---
'@backstage/core-app-api': patch
---

Deprecated the defaulting of the `components`, `icons` and `themes` options of `createApp`, meaning it will become required in the future. When not passing the required options a deprecation warning is currently logged, and they will become required in a future release.

The keep using the default set of options, migrate to using `withDefaults` from `@backstage/core-components`:

```ts
const app = createApp(
  withDefaults({
    // ...
  }),
);
```
