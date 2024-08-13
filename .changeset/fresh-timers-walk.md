---
'@backstage/frontend-plugin-api': patch
---

Support overriding of plugin extensions using the new `plugin.override` method.

```tsx
import homePlugin from '@backstage/plugin-home';

export default homePlugin.override({
  extensions: [
    homePage.getExtension('page:home').override({
      *factory(originalFactory) {
        yield* originalFactory();
        yield coreExtensionData.reactElement(<h1>My custom home page</h1>);
      },
    }),
  ],
});
```
