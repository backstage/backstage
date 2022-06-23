# @backstage/plugin-techdocs-module-addons-contrib

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.0
  - @backstage/plugin-techdocs-react@1.0.2-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/integration-react@1.1.2-next.0

## 1.0.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 6968b65ba1: Updated dependency `@react-hookz/web` to `^14.0.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5
  - @backstage/integration@1.2.1
  - @backstage/core-plugin-api@1.0.3
  - @backstage/integration-react@1.1.1
  - @backstage/plugin-techdocs-react@1.0.1

## 1.0.1-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/integration-react@1.1.1-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-techdocs-react@1.0.1-next.1

## 1.0.1-next.0

### Patch Changes

- 6968b65ba1: Updated dependency `@react-hookz/web` to `^14.0.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-techdocs-react@1.0.1-next.0
  - @backstage/integration-react@1.1.1-next.0

## 1.0.0

### Major Changes

- 0ad901569f: The TechDocs Addon framework is now generally available.

### Minor Changes

- 5f4dbd2b52: A package for contributed TechDocs addons.

  In this release it will introduce the ReportIssue addon, which lets you select text and open a GitHub/Gitlab issue.

### Patch Changes

- 10d86dedc0: Improved inline/type documentation for the <ReportIssue /> addon.
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

- 075a9a067b: Updated the return type of `createTechDocsAddonExtension` to better reflect the fact that passing children to Addon components is not a valid use-case.
- c25e880e36: Introducing the Expandable Navigation addon, which lets you expand and collapse the TechDocs main navigation and store your preference in local storage.
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/integration@1.2.0
  - @backstage/core-plugin-api@1.0.2
  - @backstage/integration-react@1.1.0
  - @backstage/plugin-techdocs-react@1.0.0

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
