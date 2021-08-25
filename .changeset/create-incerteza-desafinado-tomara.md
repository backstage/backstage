---
'@backstage/create-app': patch
---

Wire up TechDocs, which now relies on the composability API for routing.

First, ensure you've mounted `<TechDocsReaderPage />`. If you already updated
to use the composable `<TechDocsIndexPage />` (see below), no action is
necessary. Otherwise, update your `App.tsx` so that `<TechDocsReaderPage />` is
mounted:

```diff
     <Route path="/docs" element={<TechdocsPage />} />
+    <Route
+      path="/docs/:namespace/:kind/:name/*"
+      element={<TechDocsReaderPage />}
+    />
```

Next, ensure links from the Catalog Entity Page to its TechDocs site are bound:

```diff
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
+     viewTechDoc: techdocsPlugin.routes.docRoot,
    });
```
