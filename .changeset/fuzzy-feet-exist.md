---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Deprecated the `namespace` option for `createExtensionBlueprint` and `createExtension`, these are no longer required and will default to the `pluginId` instead.

You can migrate some of your extensions that use `createExtensionOverrides` to using `createFrontendModule` instead and providing a `pluginId` there.

```ts
// Before
createExtensionOverrides({
  extensions: [
    createExtension({
      name: 'my-extension',
      namespace: 'my-namespace',
      kind: 'test',
      ...
    })
  ],
});

// After
createFrontendModule({
  pluginId: 'my-namespace',
  extensions: [
    createExtension({
      name: 'my-extension',
      kind: 'test',
      ...
    })
  ],
});
```
