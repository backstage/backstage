---
'@backstage/frontend-plugin-api': patch
---

Introduce a new way to encapsulate extension kinds that replaces the extension creator pattern with `createExtensionBlueprint`

This allows the creation of extension instances with the following pattern:

```tsx
// create the extension blueprint which is used to create instances
const EntityCardBlueprint = createExtensionBlueprint({
  kind: 'entity-card',
  attachTo: { id: 'test', input: 'default' },
  output: [coreExtensionData.reactElement],
  factory(params: { text: string }) {
    return [coreExtensionData.reactElement(<h1>{params.text}</h1>)];
  },
});

// create an instance of the extension blueprint with params
const testExtension = EntityCardBlueprint.make({
  name: 'foo',
  params: {
    text: 'Hello World',
  },
});
```
