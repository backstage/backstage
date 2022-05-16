---
'@backstage/create-app': patch
---

Integrates TechDocs add-ons with the app package so add-ons are configured when creating an app using the Backstage CLI. To apply these changes to an existing application do the following:

1. Add the `@backstage/plugin-techdocs-react` and `@backstage/plugin-techdocs-module-addons-contrib` packages to your app's dependencies;
2. And then register the `<ReportIssue/ >` Addon in your `packages/app/src/App.tsx` file, there where you define a route to `<TechDocsReaderPage />`:

```diff
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
+ import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
+ import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';

// ...

const AppRoutes = () => {
  <FlatRoutes>
    // ... other plugin routes
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
+     <TechDocsAddons>
+       <ReportIssue />
+     </TechDocsAddons>
    </Route>
  </FlatRoutes>;
};
```
