---
'@backstage/frontend-plugin-api': patch
---

Introduce a new way to create extension types and kinds, with `createExtensionKind`.

This allows the creation of extension with the following pattern:

```tsx
// create the extension kind
const EntityCardBlueprint = createExtensionBlueprint({
  kind: 'entity-card',
  attachTo: { id: 'test', input: 'default' },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory(_, params: { text: string }) {
    return {
      element: <h1>{params.text}</h1>,
    };
  },
});

// create an instance of the extension kind with props
const testExtension = EntityCardBlueprint.make({
  name: 'foo',
  params: {
    text: 'Hello World',
  },
});
```
