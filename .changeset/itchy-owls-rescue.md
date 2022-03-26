---
'@backstage/create-app': patch
---

Update the setup of the app routes in the template to wrap the `<Navigate .../>` redirect in a `<Route .../>`, as this will be required in `react-router` v6 stable.

To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

```diff
   <FlatRoutes>
-    <Navigate key="/" to="catalog" />
+    <Route path="/" element={<Navigate to="catalog" />} />
```
