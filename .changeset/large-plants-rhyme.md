---
'@backstage/frontend-plugin-api': patch
---

It is now possible to override the blueprint parameters when overriding an extension created from a blueprint:

```ts
const myExtension = MyBlueprint.make({
  params: {
    myParam: 'myDefault',
  },
});

const myOverride = myExtension.override({
  params: {
    myParam: 'myOverride',
  },
});
const myFactoryOverride = myExtension.override({
  factory(origFactory) {
    return origFactory({
      params: {
        myParam: 'myOverride',
      },
    });
  },
});
```

The provided parameters will be merged with the original parameters of the extension.
