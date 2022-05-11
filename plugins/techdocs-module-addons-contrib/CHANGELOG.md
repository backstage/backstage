# @backstage/plugin-techdocs-module-addons-contrib

## 0.1.0-next.2

### Patch Changes

- 52419be116: Create a TechDocs `<TextSize/>` addon that allows users to set a font size in the browser's local storage for the text of documentation pages.

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

- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-techdocs-react@0.1.1-next.2
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/integration@1.2.0-next.1
  - @backstage/integration-react@1.1.0-next.2

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-techdocs-react@0.1.1-next.1
  - @backstage/integration-react@1.1.0-next.1

## 0.1.0-next.0

### Minor Changes

- 5f4dbd2b52: A package for contributed TechDocs addons.

  In this release it will introduce the ReportIssue addon, which lets you select text and open a GitHub/Gitlab issue.

### Patch Changes

- 075a9a067b: Updated the return type of `createTechDocsAddonExtension` to better reflect the fact that passing children to Addon components is not a valid use-case.
- Updated dependencies
  - @backstage/integration@1.2.0-next.0
  - @backstage/integration-react@1.1.0-next.0
  - @backstage/plugin-techdocs-react@0.1.1-next.0
