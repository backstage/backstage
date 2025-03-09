---
'@backstage/frontend-app-api': minor
---

**BREAKING**: The returned object from `createSpecializedApp` no longer contains a `createRoot()` method, and it instead now contains `apis` and `tree`.

You can replace existing usage of `app.createRoot()` with the following:

```ts
const root = tree.root.instance?.getData(coreExtensionData.reactEleme
nt);
```
