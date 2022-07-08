---
'@backstage/plugin-catalog': minor
---

Plugin catalog has been modified to use an experimental feature where you can customize the title of the create button.

You can modify it by doing:

```typescript jsx
import { catalogPlugin } from '@backstage/plugin-catalog';

catalogPlugin.__experimentalReconfigure({
  createButtonTitle: 'New',
});
```
