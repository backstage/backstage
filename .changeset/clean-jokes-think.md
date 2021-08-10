---
'@backstage/plugin-techdocs': patch
---

Expose a new composable `TechDocsIndexPage` and a `DefaultTechDocsHome` with support for starring docs and filtering on owned, starred, owner, and tags.

You can migrate to the new UI view by making the following changes in your `App.tsx`:

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
