---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the deprecated `ExtensionFactoryMiddleware` type export. Import it from `@backstage/frontend-app-api` instead:

```diff
-import type { ExtensionFactoryMiddleware } from '@backstage/frontend-plugin-api';
+import type { ExtensionFactoryMiddleware } from '@backstage/frontend-app-api';
```

Add `@backstage/frontend-app-api` as a dependency of your app package if it is not already declared. Middleware behavior is unchanged.
