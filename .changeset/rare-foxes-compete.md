---
'@backstage/frontend-plugin-api': patch
---

Extensions have been changed to be declared with an array of inputs and outputs, rather than a map of named data refs. This change was made to reduce confusion around the role of the input and output names, as well as enable more powerful APIs for overriding extensions.

An extension that was previously declared like this:

```tsx
const exampleExtension = createExtension({
  name: 'example',
  inputs: {
    items: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs }) {
    return {
      element: (
        <div>
          Example
          {inputs.items.map(item => {
            return <div>{item.output.element}</div>;
          })}
        </div>
      ),
    };
  },
});
```

Should be migrated to the following:

```tsx
const exampleExtension = createExtension({
  name: 'example',
  inputs: {
    items: createExtensionInput([coreExtensionData.reactElement]),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    return [
      coreExtensionData.reactElement(
        <div>
          Example
          {inputs.items.map(item => {
            return <div>{item.get(coreExtensionData.reactElement)}</div>;
          })}
        </div>,
      ),
    ];
  },
});
```
