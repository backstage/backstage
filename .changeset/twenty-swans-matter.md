---
'@backstage/core-app-api': patch
---

Deprecated the defaulting of the `components` options of `createApp`, meaning it will become required in the future. When not passing the required components options a deprecation warning is currently logged, and it will become required in a future release.

The keep the existing components intact, migrate to using `defaultAppComponents` from `@backstage/core-components`:

```ts
const app = createApp({
  components: {
    ...defaultAppComponents(),
    // Place any custom components here
  },
});
```
