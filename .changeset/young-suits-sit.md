---
'@backstage/backend-common': minor
---

Removed the custom error types (e.g. `NotFoundError`). Those are now instead in the new `@backstage/errors` package. This is a breaking change, and you will have to update your imports if you were using these types.

```diff
-import { NotFoundError } from '@backstage/backend-common';
+import { NotFoundError } from '@backstage/errors';
```
