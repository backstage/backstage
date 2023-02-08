---
'@backstage/plugin-techdocs-module-addons-contrib': patch
'@backstage/plugin-techdocs': patch
---

Create a TechDocs `<LightBox/>` addon that allows users to open images in a light-box on documentation pages, they can navigate between images if there are several on one page.

Here's an example on how to use it in a Backstage app:

```diff
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react/alpha';
+import { LightBox } from '@backstage/plugin-techdocs-module-addons-contrib';

const AppRoutes = () => {
  <FlatRoutes>
    // other plugin routes
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
+       <LightBox />
      </TechDocsAddons>
    </Route>
  </FlatRoutes>;
};
```
