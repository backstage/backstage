---
'@backstage/create-app': patch
---

Updated the app template to use the new `AppRouter` component instead of `app.getRouter()`, as well as `app.createRoot()` instead of `app.getProvider()`.

To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

```diff
-import { FlatRoutes } from '@backstage/core-app-api';
+import { AppRouter, FlatRoutes } from '@backstage/core-app-api';

 ...

-const AppProvider = app.getProvider();
-const AppRouter = app.getRouter();

 ...

-const App = () => (
+export default app.createRoot(
-  <AppProvider>
+  <>
     <AlertDisplay />
     <OAuthRequestDialog />
     <AppRouter>
       <Root>{routes}</Root>
     </AppRouter>
-  </AppProvider>
+  </>,
 );
```

The final export step should end up looking something like this:

```tsx
export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

Note that `app.createRoot()` accepts a React element, rather than a component.
