# @backstage/plugin-techdocs-react

## 1.0.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/version-bridge@1.0.1

## 1.0.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/version-bridge@1.0.1

## 1.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/core-components@0.11.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/version-bridge@1.0.1

## 1.0.4

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2

## 1.0.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3

## 1.0.4-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1

## 1.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0

## 1.0.3

### Patch Changes

- 29d6cf0147: Add `toLowerEntityRefMaybe()` helper function for handling `techdocs.legacyUseCaseSensitiveTripletPaths` flag.
  Pass modified `entityRef` to `TechDocsReaderPageContext` to handle the `techdocs.legacyUseCaseSensitiveTripletPaths` flag.
- Updated dependencies
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5

## 1.0.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.0-next.2

## 1.0.3-next.1

### Patch Changes

- 29d6cf0147: Add `toLowerEntityRefMaybe()` helper function for handling `techdocs.legacyUseCaseSensitiveTripletPaths` flag.
  Pass modified `entityRef` to `TechDocsReaderPageContext` to handle the `techdocs.legacyUseCaseSensitiveTripletPaths` flag.
- Updated dependencies
  - @backstage/core-components@0.10.1-next.1

## 1.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/core-components@0.10.1-next.0

## 1.0.2

### Patch Changes

- c3cfc83af2: Updated JSDoc to be MDX compatible.
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/catalog-model@1.1.0
  - @backstage/core-plugin-api@1.0.4

## 1.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2

## 1.0.2-next.0

### Patch Changes

- c3cfc83af2: Updated JSDoc to be MDX compatible.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0

## 1.0.1

### Patch Changes

- 3b45ad701f: Creates a `TechDocsShadowDom` component that takes a tree of elements and an `onAppend` handler:

  - Calls the `onAppend` handler when appending the element tree to the shadow root;
  - Also dispatches an event when styles are loaded to let transformers know that the computed styles are ready to be consumed.

- Updated dependencies
  - @backstage/core-components@0.9.5
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0

## 1.0.1-next.0

### Patch Changes

- 3b45ad701f: Creates a `TechDocsShadowDom` component that takes a tree of elements and an `onAppend` handler:

  - Calls the `onAppend` handler when appending the element tree to the shadow root;
  - Also dispatches an event when styles are loaded to let transformers know that the computed styles are ready to be consumed.

- Updated dependencies
  - @backstage/core-components@0.9.5-next.0

## 1.0.0

### Major Changes

- 0ad901569f: The TechDocs Addon framework is now generally available.

### Patch Changes

- 52419be116: Create a new addon location called "Settings", it is designed for addons that allow users to customize the reading experience in documentation pages.

  Usage example:

  ```tsx
  const TextSize = techdocsModuleAddonsContribPlugin.provide(
    createTechDocsAddonExtension({
      name: 'TextSize',
      location: TechDocsAddonLocations.Settings,
      component: TextSizeAddon,
    }),
  );
  ```

- c25e880e36: Added overload signatures for `createTechDocsAddonExtension` to handle TechDocs addons without props.
- 52fddad92d: The `TechDocsStorageApi` and its associated ref are now exported by `@backstage/plugin-techdocs-react`. The API interface, ref, and types are now deprecated in `@backstage/plugin-techdocs` and will be removed in a future release.
- 075a9a067b: Updated the return type of `createTechDocsAddonExtension` to better reflect the fact that passing children to Addon components is not a valid use-case.
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/catalog-model@1.0.2

## 0.1.1-next.2

### Patch Changes

- 52419be116: Create a new addon location called "Settings", it is designed for addons that allow users to customize the reading experience in documentation pages.

  Usage example:

  ```tsx
  const TextSize = techdocsModuleAddonsContribPlugin.provide(
    createTechDocsAddonExtension({
      name: 'TextSize',
      location: TechDocsAddonLocations.Settings,
      component: TextSizeAddon,
    }),
  );
  ```

- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.1.1-next.1

### Patch Changes

- 52fddad92d: The `TechDocsStorageApi` and its associated ref are now exported by `@backstage/plugin-techdocs-react`. The API interface, ref, and types are now deprecated in `@backstage/plugin-techdocs` and will be removed in a future release.
- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0

## 0.1.1-next.0

### Patch Changes

- 075a9a067b: Updated the return type of `createTechDocsAddonExtension` to better reflect the fact that passing children to Addon components is not a valid use-case.

## 0.1.0

### Minor Changes

- ff1cc8bced: This package will house frontend utilities related to TechDocs to be shared across other frontend Backstage packages.

  In this release, it introduces a framework that can be used create TechDocs addons.

  Note: this package is not necessarily stable yet. After iteration on this package, its stability will be signaled by a major-version bump.

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- Updated dependencies
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/version-bridge@1.0.1

## 0.1.0-next.0

### Minor Changes

- ff1cc8bced: This package will house frontend utilities related to TechDocs to be shared across other frontend Backstage packages.

  In this release, it introduces a framework that can be used create TechDocs addons.

  Note: this package is not necessarily stable yet. After iteration on this package, its stability will be signaled by a major-version bump.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
