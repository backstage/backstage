---
'@backstage/plugin-scaffolder-node': patch
---

**BREAKING ALPHA**: We've moved the `scaffolderActionsExtensionPoint` from `/alpha` to the main export.

```tsx
// before
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

// after
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
```
