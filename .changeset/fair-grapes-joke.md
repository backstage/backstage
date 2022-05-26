---
'@backstage/create-app': patch
---

Register `TechDocs` addons on catalog entity pages, follow the steps below to add them manually:

```diff
// packages/app/src/components/catalog/EntityPage.tsx

+ import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
+ import {
+   ReportIssue,
+ } from '@backstage/plugin-techdocs-module-addons-contrib';

+ const techdocsContent = (
+   <EntityTechdocsContent>
+     <TechDocsAddons>
+       <ReportIssue />
+     </TechDocsAddons>
+   </EntityTechdocsContent>
+ );

const defaultEntityPage = (
  ...
  <EntityLayout.Route path="/docs" title="Docs">
+    {techdocsContent}
  </EntityLayout.Route>
  ...
);

const serviceEntityPage = (
  ...
  <EntityLayout.Route path="/docs" title="Docs">
+    {techdocsContent}
  </EntityLayout.Route>
  ...
);

const websiteEntityPage = (
  ...
  <EntityLayout.Route path="/docs" title="Docs">
+    {techdocsContent}
  </EntityLayout.Route>
  ...
);
```
