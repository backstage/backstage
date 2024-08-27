---
'@backstage/frontend-plugin-api': patch
---

Deprecate the `id` in `createFrontendPlugin` in favour of `pluginId` to match the same as the backend.

```ts
const myPlugin = createFrontendPlugin({
  pluginId: 'my-plugin',
  extensions: [
    ...
  ]
});
```
