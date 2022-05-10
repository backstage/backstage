---
'@backstage/plugin-techdocs-module-addons-contrib': patch
---

Create a TechDocs `<TextSize/>` addon that allows users to set a font size in the browser's local storage for the text of documentation pages.

Here's an example on how to use it in a Backstage app:

```diff
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react/alpha';
+import { TextSize } from '@backstage/plugin-techdocs-module-addons-contrib';

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
+       <TextSize />
      </TechDocsAddons>
    </Route>
  </FlatRoutes>;
};
```
