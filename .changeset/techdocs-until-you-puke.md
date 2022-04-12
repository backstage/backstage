---
'@backstage/plugin-techdocs': minor
---

TechDocs supports a new, experimental method of customization: addons!

To customize the standalone TechDocs reader page experience, update your `/packages/app/src/App.tsx` in the following way:

```diff
import { TechDocsIndexPage, TechDocsReaderPage } from '@backstage/plugin-techdocs';
+ import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
+ import { SomeAddon } from '@backstage/plugin-some-plugin';

// ...

    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
+      <TechDocsAddons>
+        <SomeAddon />
+      </TechDocsAddons>
    </Route>

// ...
```

To customize the TechDocs reader experience on the Catalog entity page, update your `packages/app/src/components/catalog/EntityPage.tsx` in the following way:

```diff
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
+ import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
+ import { SomeAddon } from '@backstage/plugin-some-plugin';

// ...

  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
-      <EntityTechDocsContent />
+      <EntityTechdocsContent>
+        <TechDocsAddons>
+          <SomeAddon />
+        </TechDocsAddons>
+      </EntityTechdocsContent>
    </EntityLayout.Route>
  </EntityLayoutWrapper>

// ...
```

If you do not wish to customize your TechDocs reader experience in this way at this time, no changes are necessary!
