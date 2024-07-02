---
'@backstage/frontend-plugin-api': patch
---

Introduce a new way to create extension types and kinds, with `createExtensionKind`.

This allows the creation of extension with the following pattern:

```tsx
// create the extension kind
const TestExtensionKind = createExtensionKind({
  kind: 'test-extension',
  attachTo: { id: 'test', input: 'default' },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory(_, options: { text: string }) {
    return {
      element: <h1>{options.text}</h1>,
    };
  },
});

// create an instance of the extension kind with props
const testExtension = TestExtensionKind.new({
  name: 'foo',
  options: {
    text: 'Hello World',
  },
});
```
