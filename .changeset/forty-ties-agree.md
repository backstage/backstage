---
'@backstage/frontend-plugin-api': patch
---

Added a new `IconBundleBlueprint` that lets you create icon bundle extensions that can be installed in an App in order to override or add new app icons.

```tsx
import { IconBundleBlueprint } from '@backstage/frontend-plugin-api';

const exampleIconBundle = IconBundleBlueprint.make({
  name: 'example-bundle',
  params: {
    icons: {
      user: MyOwnUserIcon,
    },
  },
});
```
