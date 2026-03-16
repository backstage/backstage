---
'@backstage/ui': minor
---

**BREAKING**: Centralized client-side routing in `BUIProvider`. Components like Link, ButtonLink, Tabs, Menu, TagGroup, and Table now require a `BUIProvider` rendered inside a React Router context for client-side navigation to work.

**Migration:**

This change requires updating `@backstage/plugin-app` and `@backstage/core-app-api` alongside `@backstage/ui`. If you only upgrade `@backstage/ui`, BUI components will fall back to full-page navigation.

If you cannot upgrade all packages together, or if you have a custom app shell, add a `BUIProvider` inside your Router:

```diff
+ import { BUIProvider } from '@backstage/ui';

  <BrowserRouter>
+   <BUIProvider>
      <AppContent />
+   </BUIProvider>
  </BrowserRouter>
```

**Affected components:** Link, ButtonLink, Tabs, Menu, TagGroup, Table
