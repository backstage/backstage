---
'@backstage/frontend-plugin-api': patch
---

Extension data references can now be defined in a way that encapsulates the ID string in the type, in addition to the data type itself. The old way of creating extension data references is deprecated and will be removed in a future release.

For example, the following code:

```ts
export const myExtension = createExtensionDataRef<MyType>('my-plugin.my-data');
```

Should be updated to the following:

```ts
export const myExtension = createExtensionDataRef<MyType>().with({
  id: 'my-plugin.my-data',
});
```
