---
'@backstage/create-app': patch
---

Use new composable `TechDocsIndexPage` and `DefaultTechDocsHome`

Make the following changes to your `App.tsx` to migrate existing apps:

```diff
-    <Route path="/docs" element={<TechdocsPage />} />
+    <Route path="/docs" element={<TechDocsIndexPage />}>
+      <DefaultTechDocsHome />
+    </Route>
+    <Route
+      path="/docs/:namespace/:kind/:name/*"
+      element={<TechDocsReaderPage />}
+    />
```
