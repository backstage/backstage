---
'@backstage/plugin-catalog-react': minor
---

Introduces a new `EntityHeaderBlueprint` that allows you to override the default entity page header.

```jsx
import { EntityHeaderBlueprint } from '@backstage/plugin-catalog-react/alpha';

EntityHeaderBlueprint.make({
  name: 'my-default-header',
  params: {
    loader: () => import('./MyDefaultHeader').then(m => <m.MyDefaultHeader />),
  },
});
```
