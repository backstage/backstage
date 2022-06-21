# @backstage/plugin-catalog-react

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/catalog-client@1.0.4-next.0

## 1.1.1

### Patch Changes

- 1f70704580: Accessibility updates:

  - Wrapped the `EntityLifecyclePicker`, `EntityOwnerPicker`, `EntityTagPicker`, in `label` elements
  - Changed group name `Typography` component to `span` (from default `h6`), added `aria-label` to the `List` component, and `role` of `menuitem` to the container of the `MenuItem` component

- 568f2d1e75: Table component no longer has drag and drop columns by default
- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.3
  - @backstage/core-components@0.9.5
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/plugin-permission-common@0.6.2
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-permission-react@0.4.2

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-permission-react@0.4.2-next.0
  - @backstage/plugin-catalog-common@1.0.3-next.0

## 1.1.1-next.0

### Patch Changes

- 1f70704580: Accessibility updates:

  - Wrapped the `EntityLifecyclePicker`, `EntityOwnerPicker`, `EntityTagPicker`, in `label` elements
  - Changed group name `Typography` component to `span` (from default `h6`), added `aria-label` to the `List` component, and `role` of `menuitem` to the container of the `MenuItem` component

- Updated dependencies
  - @backstage/core-components@0.9.5-next.0
  - @backstage/integration@1.2.1-next.0

## 1.1.0

### Minor Changes

- 4274844a8c: Use InfoCardVariants on custom cards variant attribute

### Patch Changes

- 0418447669: Added menu parent role for menu items accessibility
- b7514d19ff: Update the rendering of links in the entity inspector so that values starting with `https?://` are rendered as links as well.
- b880c0e092: Fix `EntityTypeFilter` so generating available types is case insensitive
- 57f41fb8d6: Make Menu item on filters accessible through keyboard
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/integration@1.2.0
  - @backstage/core-plugin-api@1.0.2
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-catalog-common@1.0.2
  - @backstage/plugin-permission-common@0.6.1
  - @backstage/plugin-permission-react@0.4.1

## 1.1.0-next.2

### Patch Changes

- 57f41fb8d6: Make Menu item on filters accessible through keyboard
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/integration@1.2.0-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0
  - @backstage/plugin-permission-react@0.4.1-next.1
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.2-next.0

## 1.1.0-next.1

### Patch Changes

- 0418447669: Added menu parent role for menu items accessibility
- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-permission-react@0.4.1-next.0

## 1.1.0-next.0

### Minor Changes

- 4274844a8c: Use InfoCardVariants on custom cards variant attribute

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.2.0-next.0

## 1.0.1

### Patch Changes

- 0ffd88a90e: Prevent permissions with types other than `ResourcePermission<'catalog-entity'>` from being used with the `useEntityPermission` hook.
- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 4af82967f4: Decouple tags picker from backend entities

  `EntityTagPicker` fetches all the tags independently and it doesn't require all the entities to be available client side.

- 4be0d1e777: Changed catalog filter components to only pay attention to query parameters relevant to the component.
- 5d5fdbe541: Columns in CatalogTable now change depending on the entity kind, ensuring only relevant columns are displayed.
- 863e7bcb7b: Updated the "unregister location" behavior in `UnregisterEntityDialog`. Removed unnecessary entity deletion requests that were sent after successfully deleting a location.
- 37b04b5a5e: Removed broken link from Labels section of entity inspector.
- a496cee4d1: Add support for string refs to the `EntityRefLinks` component
- d34900af81: Added a new `NextScaffolderRouter` which will eventually replace the exiting router
- 99063c39ae: Minor API report cleanup
- 4431873583: Update `usePermission` usage.
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/plugin-permission-react@0.4.0
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/version-bridge@1.0.1
  - @backstage/plugin-catalog-common@1.0.1
  - @backstage/catalog-client@1.0.1

## 1.0.1-next.3

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 863e7bcb7b: Updated the "unregister location" behavior in `UnregisterEntityDialog`. Removed unnecessary entity deletion requests that were sent after successfully deleting a location.
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/plugin-permission-react@0.4.0-next.1
  - @backstage/integration@1.1.0-next.2

## 1.0.1-next.2

### Patch Changes

- 4be0d1e777: Changed catalog filter components to only pay attention to query parameters relevant to the component.
- 5d5fdbe541: Columns in CatalogTable now change depending on the entity kind, ensuring only relevant columns are displayed.
- 99063c39ae: Minor API report cleanup
- Updated dependencies
  - @backstage/core-components@0.9.3-next.1
  - @backstage/catalog-model@1.0.1-next.1

## 1.0.1-next.1

### Patch Changes

- 0ffd88a90e: Prevent permissions with types other than `ResourcePermission<'catalog-entity'>` from being used with the `useEntityPermission` hook.
- 4af82967f4: Decouple tags picker from backend entities

  `EntityTagPicker` fetches all the tags independently and it doesn't require all the entities to be available client side.

- 37b04b5a5e: Removed broken link from Labels section of entity inspector.
- 4431873583: Update `usePermission` usage.
- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/plugin-permission-react@0.4.0-next.0
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.1

## 1.0.1-next.0

### Patch Changes

- a496cee4d1: Add support for string refs to the `EntityRefLinks` component
- d34900af81: Added a new `NextScaffolderRouter` which will eventually replace the exiting router
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/catalog-client@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- f7fb7295e6: **BREAKING**: Removed the deprecated `favoriteEntityTooltip` and `favoriteEntityIcon` functions.
- 4cd92028b8: **BREAKING**: The following deprecated annotation reading helper functions were removed:

  - `getEntityMetadataViewUrl`, use `entity.metadata.annotations?.[ANNOTATION_VIEW_URL]` instead.
  - `getEntityMetadataEditUrl`, use `entity.metadata.annotations?.[ANNOTATION_EDIT_URL]` instead.

- 1f2757bb07: **BREAKING**: The `useEntity` hook no longer returns loading or error states, and will throw an error if the entity is not immediately available. In practice this means that `useEntity` can only be used in contexts where the entity is guaranteed to have been loaded, for example inside an `EntityLayout`. To access the loading state of the entity, use `useAsyncEntity` instead.
- 0f3520d499: **BREAKING**: Removed the deprecated `formatEntityRefTitle`, use `humanizeEntityRef` instead.

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- c689d7a94c: Added `CatalogFilterLayout`, which replaces `FilteredEntityLayout` from `@backstage/plugin-catalog`, as well as `FilterContainer` and `EntityListContainer`. It is used like this:

  ```tsx
  <CatalogFilterLayout>
    <CatalogFilterLayout.Filters>
      {/* filter drawer, for example <EntityTypePicker /> and friends */}
    </CatalogFilterLayout.Filters>
    <CatalogFilterLayout.Content>
      {/* content view, for example a <CatalogTable /> */}
    </CatalogFilterLayout.Content>
  </CatalogFilterLayout>
  ```

- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/version-bridge@1.0.0
  - @backstage/plugin-permission-react@0.3.4
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-common@0.5.3

## 0.9.0

### Minor Changes

- b0af81726d: **BREAKING**: Removed `reduceCatalogFilters` and `reduceEntityFilters` due to low external utility value.
- 7ffb2c73c9: **BREAKING**: Removed the deprecated `loadCatalogOwnerRefs` function. Usages of this function can be directly replaced with `ownershipEntityRefs` from `identityApi.getBackstageIdentity()`.

  This also affects the `useEntityOwnership` hook in that it no longer uses `loadCatalogOwnerRefs`, meaning it will no longer load in additional relations and instead only rely on the `ownershipEntityRefs` from the `IdentityApi`.

- dd88d1e3ac: **BREAKING**: Removed `useEntityFromUrl`.
- 9844d4d2bd: **BREAKING**: Removed `useEntityCompoundName`, use `useRouteRefParams(entityRouteRef)` instead.
- 2b8c986ce0: **BREAKING**: Removed `useEntityListProvider` use `useEntityList` instead.
- f3a7a9de6d: **BREAKING**: Removed `useOwnedEntities` and moved its usage internally to the scaffolder-backend where it's used.

  **BREAKING**: Removed `EntityTypeReturn` type which is now inlined.

- cf1ff5b438: **BREAKING**: Removed the `useEntityKinds` hook, use `catalogApi.getEntityFacets({ facets: ['kind'] })` instead.
- fc6290a76d: **BREAKING**: Removed the deprecated `useOwnUser` hook. Existing usage can be replaced with `identityApi.getBackstageIdentity()`, followed by a call to `catalogClient.getEntityByRef(identity.userEntityRef)`.

### Patch Changes

- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- 2986f8e09d: Fixed EntityOwnerPicker and OwnershipCard url filter issue with more than 21 owners
- f3a7a9de6d: Internalized usage of `useOwnedEntities` hook.
- Updated dependencies
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0

## 0.9.0-next.0

### Minor Changes

- b0af81726d: **BREAKING**: Removed `reduceCatalogFilters` and `reduceEntityFilters` due to low external utility value.
- 7ffb2c73c9: **BREAKING**: Removed the deprecated `loadCatalogOwnerRefs` function. Usages of this function can be directly replaced with `ownershipEntityRefs` from `identityApi.getBackstageIdentity()`.

  This also affects the `useEntityOwnership` hook in that it no longer uses `loadCatalogOwnerRefs`, meaning it will no longer load in additional relations and instead only rely on the `ownershipEntityRefs` from the `IdentityApi`.

- dd88d1e3ac: **BREAKING**: Removed `useEntityFromUrl`.
- 9844d4d2bd: **BREAKING**: Removed `useEntityCompoundName`, use `useRouteRefParams(entityRouteRef)` instead.
- 2b8c986ce0: **BREAKING**: Removed `useEntityListProvider` use `useEntityList` instead.
- f3a7a9de6d: **BREAKING**: Removed `useOwnedEntities` and moved its usage internally to the scaffolder-backend where it's used.

  **BREAKING**: Removed `EntityTypeReturn` type which is now inlined.

- cf1ff5b438: **BREAKING**: Removed the `useEntityKinds` hook, use `catalogApi.getEntityFacets({ facets: ['kind'] })` instead.
- fc6290a76d: **BREAKING**: Removed the deprecated `useOwnUser` hook. Existing usage can be replaced with `identityApi.getBackstageIdentity()`, followed by a call to `catalogClient.getEntityByRef(identity.userEntityRef)`.

### Patch Changes

- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- 2986f8e09d: Fixed EntityOwnerPicker and OwnershipCard url filter issue with more than 21 owners
- f3a7a9de6d: Internalized usage of `useOwnedEntities` hook.
- Updated dependencies
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0

## 0.8.1

### Patch Changes

- Fixed runtime resolution of the `/alpha` entry point.
- Updated dependencies
  - @backstage/catalog-model@0.12.1

## 0.8.0

### Minor Changes

- da79aac2a6: Removed some previously deprecated `routeRefs` as follows:

  - **BREAKING**: Removed `entityRoute` in favor of `entityRouteRef`.
  - **BREAKING**: Removed the previously deprecated `rootRoute` and `catalogRouteRef`. If you want to refer to the catalog index page from a public plugin you now need to use an `ExternalRouteRef` instead. For private plugins it is possible to take the shortcut of referring directly to `catalogPlugin.routes.indexPage` instead.

- e26fd1c7ab: Marked `useEntityPermission` as alpha since the underlying permission framework is under active development.
- 2de1d82bd1: Removing the `EntityName` path for the `useEntityOwnership` as it has never worked correctly. Please pass in an entire `Entity` instead.

### Patch Changes

- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- f41a293231: - **DEPRECATION**: Deprecated `formatEntityRefTitle` in favor of the new `humanizeEntityRef` method instead. Please migrate to using the new method instead.
- f590d1681b: Deprecated `favoriteEntityTooltip` and `favoriteEntityIcon` since the utility value is very low.
- 72431d7bed: - **BREAKING**: The `isOwnerOf` function has been marked as `@alpha` and is now only available via the `@backstage/plugin-catalog-react/alpha` import. The limitations of this function with regards to only supporting direct relations have also been documented.
- 03ec06bf7f: **BREAKING**: Moved **DefaultStarredEntitiesApi** to `@backstage/plugin-catalog`. If you were using this in tests, you can use the new `MockStarredEntitiesApi` from `@backstage/plugin-catalog-react` instead.

  Fixed a risky behavior where `DefaultStarredEntitiesApi` forwarded values to observers that were later mutated.

  Removed the `isStarred` method from `DefaultStarredEntitiesApi`, as it is not part of the `StarredEntitiesApi`.

- 44403296e7: Added the following deprecations to the `catalog-react` package:

  - **DEPRECATION**: `useEntity` will now warn if the entity has not yet been loaded, and will soon throw errors instead. If you're using the default implementation of `EntityLayout` and `EntitySwitch` then these components will ensure that there is an entity loaded before rendering children. If you're implementing your own `EntityLayout` or `EntitySwitch` or something that operates outside or adjacent to them, then use `useAsyncEntity`.

  - **DEPRECATION**: the `loading`, `error` and `refresh` properties that are returned from `useEntity` have been deprecated, and are available on `useAsyncEntity` instead.

- 8f0e8e039b: Deprecated `getEntityMetadataEditUrl` and `getEntityMetadataViewUrl` as these just return one annotation from the entity passed in.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- bb2bb36651: Updated usage of `StorageApi` to use `snapshot` method instead of `get`
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/core-components@0.9.0
  - @backstage/integration@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-permission-react@0.3.3

## 0.7.0

### Minor Changes

- 3334ad47d4: Removed the deprecated `EntityContext` which have been replaced by `useEntity`, `EntityProvider` and `AsyncEntityProvider`.
- e2e0b6625c: Improved API documentation.

  **BREAKING**: The individual table column factories (e.g. `createEntityRefColumn`) are now no longer available directly, but only through `EntityTable.columns`.

- c4276915c0: **BREAKING**: Deleted the deprecated `loadIdentityOwnerRefs` function which is replaced by `ownershipEntityRefs` from `identityApi.getBackstageIdentity()`.

  Deprecated the `loadCatalogOwnerRefs` hook as membership references should be added as `ent` inside `claims` sections of the `SignInResolver` when issuing tokens. See https://backstage.io/docs/auth/identity-resolver for more details on how to prepare your `SignInResolver` if not done already. Usage of the `loadCatalogOwnerRefs` hook should be replaced by `ownershipEntityRefs` from `identityApi.getBackstageIdentity()` instead.

### Patch Changes

- a8331830f1: Deprecated the `useEntityKinds` hook due to low usage and utility value.
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- b776ce5aab: Deprecated the `useEntityListProvider` hook which is now renamed to `useEntityList`
- b3ef24038b: Deprecated `reduceCatalogFilters` and `reduceEntityFilters` as these helper functions are used internally and provides low external value.
- 2d339b5f2c: Deprecated `useEntityFromUrl` and the `useEntityCompoundName` hooks as these have very low utility value.
- 96b8ae9a9e: Deprecated the `EntityTypeReturn` type and inlined the return type to `useEntityTypeFilter` as the type and function name does not align
- d4f67fa728: Deprecated the `useOwnedEntities` hook which is replaced by the IdentityAPI.
  Deprecated the `useOwnUser` hook due to low external value.
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/core-plugin-api@0.7.0
  - @backstage/integration@0.7.5
  - @backstage/plugin-permission-react@0.3.2

## 0.6.15

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- edbc03814a: Replace usage of `serializeEntityRef` with `stringifyEntityRef`
- 244d24ebc4: Import `Location` from the `@backstage/catalog-client` package.
- deaf6065db: Adapt to the new `CatalogApi.getLocationByRef`
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- e72d371296: Use `TemplateEntityV1beta2` from `@backstage/plugin-scaffolder-common` instead
  of `@backstage/catalog-model`.
- 98d1aa1ea1: Fix CatalogPage showing all components when owned filter was pre-selected
- 27eccab216: Replaces use of deprecated catalog-model constants.
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/catalog-client@0.7.0
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/plugin-permission-react@0.3.1
  - @backstage/catalog-model@0.10.0
  - @backstage/types@0.1.2
  - @backstage/version-bridge@0.1.2

## 0.6.14

### Patch Changes

- 680e7c7452: Updated `useEntityListProvider` and catalog pickers to respond to external changes to query parameters in the URL, such as two sidebar links that apply different catalog filters.
- f8633307c4: Added an "inspect" entry in the entity three-dots menu, for lower level catalog
  insights and debugging.
- 19155e0939: Updated React component type declarations to avoid exporting exotic component types.
- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/core-components@0.8.8

## 0.6.14-next.0

### Patch Changes

- 680e7c7452: Updated `useEntityListProvider` and catalog pickers to respond to external changes to query parameters in the URL, such as two sidebar links that apply different catalog filters.
- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/core-components@0.8.8-next.0

## 0.6.13

### Patch Changes

- f7257dff6f: The `<Link />` component now accepts a `noTrack` prop, which prevents the `click` event from being captured by the Analytics API. This can be used if tracking is explicitly not warranted, or in order to use custom link tracking in specific situations.
- 300f8cdaee: Fix bug: previously the filter would be set to "all" on page load, even if the
  `initiallySelectedFilter` on the `DefaultCatalogPage` was set to something else,
  or a different query parameter was supplied. Now, the prop and query parameters
  control the filter as expected. Additionally, after this change any filters
  which match 0 items will be disabled, and the filter will be reverted to 'all'
  if they're set on page load.
- 6acc8f7db7: Add caching to the useEntityPermission hook

  The hook now caches the authorization decision based on the permission + the entity, and returns the cache match value as the default `allowed` value while loading. This helps avoid flicker in UI elements that would be conditionally rendered based on the `allowed` result of this hook.

- Updated dependencies
  - @backstage/core-components@0.8.7

## 0.6.13-next.1

### Patch Changes

- f7257dff6f: The `<Link />` component now accepts a `noTrack` prop, which prevents the `click` event from being captured by the Analytics API. This can be used if tracking is explicitly not warranted, or in order to use custom link tracking in specific situations.
- 300f8cdaee: Fix bug: previously the filter would be set to "all" on page load, even if the
  `initiallySelectedFilter` on the `DefaultCatalogPage` was set to something else,
  or a different query parameter was supplied. Now, the prop and query parameters
  control the filter as expected. Additionally, after this change any filters
  which match 0 items will be disabled, and the filter will be reverted to 'all'
  if they're set on page load.
- 6acc8f7db7: Add caching to the useEntityPermission hook

  The hook now caches the authorization decision based on the permission + the entity, and returns the cache match value as the default `allowed` value while loading. This helps avoid flicker in UI elements that would be conditionally rendered based on the `allowed` result of this hook.

- Updated dependencies
  - @backstage/core-components@0.8.7-next.1

## 0.6.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0

## 0.6.12

### Patch Changes

- 3d87019269: The `entityRouteRef` is now a well-known route that should be imported directly from `@backstage/plugin-catalog-react`. It is guaranteed to be globally unique across duplicate installations of the `@backstage/plugin-catalog-react`, starting at this version.

  Deprecated `entityRoute` in favor of `entityRouteRef`.

  Deprecated `rootRoute` and `catalogRouteRef`. If you want to refer to the catalog index page from a public plugin you now need to use an `ExternalRouteRef` instead. For private plugins it is possible to take the shortcut of referring directly to `catalogPlugin.routes.indexPage` instead.

- 2916a83b9c: Deprecated `loadIdentityOwnerRefs`, since they can now be retrieved as `ownershipEntityRefs` from `identityApi.getBackstageIdentity()` instead.
- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- c54c0d9d10: Add useEntityPermission hook
- Updated dependencies
  - @backstage/plugin-permission-react@0.3.0
  - @backstage/core-components@0.8.5
  - @backstage/integration@0.7.2
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/core-plugin-api@0.6.0
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.6.12-next.0

### Patch Changes

- 2916a83b9c: Deprecated `loadIdentityOwnerRefs`, since they can now be retrieved as `ownershipEntityRefs` from `identityApi.getBackstageIdentity()` instead.
- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0

## 0.6.11

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/integration@0.7.1
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9

## 0.6.10

### Patch Changes

- fe2a6532ff: Add Override Components for Components in @backstage/plugin-catalog-react
- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/core-components@0.8.3

## 0.6.9

### Patch Changes

- c6fdddec77: When a user has zero owned entities when viewing an entity kind in the catalog
  page, it will be automatically redirected to see all the entities. Furthermore,
  for the kind User and Group there are no longer the owned selector.
- Updated dependencies
  - @backstage/integration@0.7.0

## 0.6.8

### Patch Changes

- 3491a36ab9: added useOwnedEntities hook to get the list of entities of the logged-in user
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/core-components@0.8.2
  - @backstage/catalog-client@0.5.3

## 0.6.7

### Patch Changes

- 6156fb8730: `useEntityTypeFilter`: Skip updating selected types if a kind filter change did not change them.
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
  - @backstage/catalog-model@0.9.8

## 0.6.6

### Patch Changes

- 4c0f0b2003: Removed dependency on `@backstage/core-app-api`.

## 0.6.5

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- 69034b4419: Fix typo in catalog-react package.json
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/core-app-api@0.2.0
  - @backstage/version-bridge@0.1.1

## 0.6.4

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/core-app-api@0.1.21

## 0.6.3

### Patch Changes

- 03b47a476d: export `loadIdentityOwnerRefs` and `loadCatalogOwnerRefs` all the way
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/catalog-client@0.5.1
  - @backstage/core-plugin-api@0.1.13
  - @backstage/core-app-api@0.1.20

## 0.6.2

### Patch Changes

- f9cc2509f8: EntityTypePicker can be hidden and have an initial filter value set, similar to EntityKindPicker
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/core-components@0.7.2
  - @backstage/catalog-model@0.9.6
  - @backstage/core-app-api@0.1.19
  - @backstage/core-plugin-api@0.1.12

## 0.6.1

### Patch Changes

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/errors@0.1.3
  - @backstage/core-app-api@0.1.18
  - @backstage/core-plugin-api@0.1.11
  - @backstage/catalog-model@0.9.5

## 0.6.0

### Minor Changes

- 82fbda923e: Introduce a new `StarredEntitiesApi` that is used in the `useStarredEntities` hook.
  The `@backstage/plugin-catalog` installs a default implementation that is backed by the `StorageApi`, but one can also override the `starredEntitiesApiRef`.

  This change also updates the storage format from a custom string to an entity reference and moves the location in the local storage.
  A migration will convert the previously starred entities to the location on the first load of Backstage.

### Patch Changes

- 0366c9b667: Introduce a `useStarredEntity` hook to check if a single entity is starred.
  It provides a more efficient implementation compared to the `useStarredEntities` hook, because the rendering is only triggered if the selected entity is starred, not if _any_ entity is starred.
- 4aca84f86b: Support `material-ui` overrides in plugin-catalog-react components
- b03b9f19e0: added sorting in entity `Name` column by `metadata.title` if present
- Updated dependencies
  - @backstage/integration@0.6.8
  - @backstage/core-app-api@0.1.17
  - @backstage/core-components@0.7.0

## 0.5.2

### Patch Changes

- 5aae9bb61e: Name column will now render entity `metadata.title` if its present
- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/core-app-api@0.1.16
  - @backstage/catalog-model@0.9.4
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7

## 0.5.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.1.15
  - @backstage/integration@0.6.6
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.5.0

### Minor Changes

- dbcaa6387a: Extends the `CatalogClient` interface with a `refreshEntity` method.

### Patch Changes

- cc464a56b3: This makes Type and Lifecycle columns consistent for all table cases and adds a new line in Description column for better readability
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/core-app-api@0.1.14

## 0.4.6

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- ea81a1f19c: Deprecated EntityContext in favor of using `useEntity`, `EntityProvider` and the new `AsyncEntityProvider` instead. This update also brings cross-version compatibility to `@backstage/catalog-react`, meaning that future versions can be used in parallel with this one.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/integration@0.6.4
  - @backstage/core-app-api@0.1.13
  - @backstage/core-plugin-api@0.1.8

## 0.4.5

### Patch Changes

- 3ed78fca3: Added a `useEntityKinds` hook to load a unique list of entity kinds from the catalog.
  Fixed a bug in `EntityTypePicker` where the component did not hide when no types were available in returned entities.
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1
  - @backstage/core-app-api@0.1.11

## 0.4.4

### Patch Changes

- 5a1eb6bfc: Memoize the context value in `EntityListProvider`.

  This removes quite a few unnecessary rerenders of the inner components.

  When running the full `CatalogPage` test:

  - Before: 98 table render calls total, 16 seconds runtime
  - After: 57 table render calls total, 14 seconds runtime

  This doesn't account for all of the slowness, but does give a minor difference in perceived speed in the browser too.

- d39e7d141: Use the history API directly in `useEntityListProvider`.

  This replaces `useSearchParams`/`useNavigate`, since they cause at least one additional re-render compared to using this method.

  Table re-render count is down additionally:

  - Initial render of catalog page: 12 -> 9
  - Full `CatalogPage` test: 57 -> 48

- Updated dependencies
  - @backstage/core-app-api@0.1.10
  - @backstage/core-components@0.3.3
  - @backstage/integration@0.6.2

## 0.4.3

### Patch Changes

- 3bc009287: Clarified messaging around configured locations in the `UnregisterEntityDialog`.
- 2105d608f: Migrate and export `UnregisterEntityDialog` component from `catalog-react` package
- Updated dependencies
  - @backstage/core-app-api@0.1.9
  - @backstage/core-components@0.3.2
  - @backstage/integration@0.6.1

## 0.4.2

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- a440d3b38: Move and rename `FavoriteEntity` component to `catalog-react`
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/core-app-api@0.1.8
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9
  - @backstage/core-app-api@0.1.7

## 0.4.0

### Minor Changes

- c5cb55803: Introduce the `useEntityOwnership` hook, which implements the full new ownership model.

  This also means a breaking change to the interface of `UserListFilter`. It no longer
  accepts a user entity as input, but rather a function that checks ownership of an
  entity. This function is taken from the above mentioned hook output. So if you are
  instantiating the filter yourself, you will change from something like

  ```ts
  const { entity } = useOwnUser();
  const filter = new UserListFilter('owned', user, ...);
  ```

  to

  ```ts
  const { isOwnedEntity } = useEntityOwnership();
  const filter = new UserListFilter('owned', isOwnedEntity, ...);
  ```

### Patch Changes

- 19d9995b6: Improve accessibility of core & catalog components by adjusting them with non-breaking changes.
- 11c370af2: Export `CATALOG_FILTER_EXISTS` symbol
- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- 043a4238f: Fix `EntityListProvider` to not update url if unmounted
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/core-app-api@0.1.6
  - @backstage/core-plugin-api@0.1.4
  - @backstage/catalog-client@0.3.18

## 0.3.1

### Patch Changes

- 221d7d060: added retry callback to useEntity hook
- Updated dependencies
  - @backstage/core-components@0.1.6
  - @backstage/catalog-client@0.3.17
  - @backstage/core-app-api@0.1.5

## 0.3.0

### Minor Changes

- 976b61080: Updated the software templates list page (`ScaffolderPage`) to use the `useEntityListProvider` hook from #5643. This reduces the code footprint, making it easier to customize the display of this page, and consolidates duplicate approaches to querying the catalog with filters.

  - The `useEntityTypeFilter` hook has been updated along with the underlying `EntityTypeFilter` to work with multiple values, to allow more flexibility for different user interfaces. It's unlikely that this change affects you; however, if you're using either of these directly, you'll need to update your usage.
  - `SearchToolbar` was renamed to `EntitySearchBar` and moved to `catalog-react` to be usable by other entity list pages
  - `UserListPicker` now has an `availableTypes` prop to restrict which user-related options to present

### Patch Changes

- d84778c25: Store filter values set in `EntityListProvider` in query parameters. This allows selected filters to be restored when returning to pages that list catalog entities.
- e13f0fb9d: Fix `EntityTypeFilter` so it produces unique case-insensitive set of available types

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/catalog-client@0.3.16

## 0.2.5

### Patch Changes

- 35a3e4e4c: Fix repetitive error reporting in EntityTypePicker
- Updated dependencies
  - @backstage/core-app-api@0.1.4
  - @backstage/core-components@0.1.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.2.4

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-app-api@0.1.3
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4

## 0.2.3

### Patch Changes

- 172c97324: Add `EntityLifecyclePicker` and `EntityOwnerPicker` UI components to allow filtering by `spec.lifecycle` and `spec.owner` on catalog-related pages.
- Updated dependencies
  - @backstage/catalog-model@0.8.3
  - @backstage/core@0.7.13

## 0.2.2

### Patch Changes

- 7028ee1ca: Expose `getEntitySourceLocation`, `getEntityMetadataViewUrl`, and
  `getEntityMetadataEditUrl` from `@backstage/plugin-catalog-react`.
- Updated dependencies [75b8537ce]
- Updated dependencies [27a9b503a]
- Updated dependencies [da8cba44f]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/core-plugin-api@0.1.2
  - @backstage/catalog-model@0.8.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.2.1

### Patch Changes

- deaba2e13: Sort `EntityTagPicker` entries.
- 8e919a6f8: Tweak the `EntityListProvider` to do single-cycle updates
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [1cf1d351f]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/catalog-model@0.8.1
  - @backstage/core@0.7.12

## 0.2.0

### Minor Changes

- 17c497b81: The default `CatalogPage` has been reworked to be more composable and make
  customization easier. This change only affects those who have replaced the
  default `CatalogPage` with a custom implementation; others can safely ignore the
  rest of this changelog.

  If you created a custom `CatalogPage` to **add or remove tabs** from the
  catalog, a custom page is no longer necessary. The fixed tabs have been replaced
  with a `spec.type` dropdown that shows all available `Component` types in the
  catalog.

  For other needs, customizing the `CatalogPage` should now be easier. The new
  [CatalogPage.tsx](https://github.com/backstage/backstage/blob/9a4baa74509b6452d7dc054d34cf079f9997166d/plugins/catalog/src/components/CatalogPage/CatalogPage.tsx)
  shows the default implementation. Overriding this with your own, similar
  `CatalogPage` component in your `App.tsx` routing allows you to adjust the
  layout, header, and which filters are available.

  See the documentation added on [Catalog
  Customization](https://backstage.io/docs/features/software-catalog/catalog-customization)
  for instructions.

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [704875e26]
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11

## 0.1.6

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/catalog-model@0.7.9

## 0.1.5

### Patch Changes

- 81c54d1f2: Fetch relations in batches in `useRelatedEntities`
- Updated dependencies [f65adcde7]
- Updated dependencies [80888659b]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/core@0.7.8
  - @backstage/catalog-model@0.7.8
  - @backstage/catalog-client@0.3.11

## 0.1.4

### Patch Changes

- 9f48b548c: Make it possible to specify entity type to `useEntity` when it's known
- Updated dependencies [676ede643]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
  - @backstage/catalog-client@0.3.9
  - @backstage/catalog-model@0.7.5

## 0.1.3

### Patch Changes

- 01ccef4c7: Introduce `useRouteRefParams` to `core-api` to retrieve typed route parameters.
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/core@0.7.3

## 0.1.2

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/catalog-client@0.3.8
  - @backstage/core@0.7.2

## 0.1.1

### Patch Changes

- 9d455f69a: Introduce parameters for namespace, kind, and name to `entityRouteRef`.
- 02816ecd7: Fixed EntityProvider setting 'loading' bool erroneously to true
- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [4c049a1a1]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0

## 0.1.0

### Minor Changes

- d0760ecdf: Moved common useStarredEntities hook to plugin-catalog-react

### Patch Changes

- 88f1f1b60: Truncate and show ellipsis with tooltip if content of
  `createMetadataDescriptionColumn` is too wide.
- 9615e68fb: Forward link styling of `EntityRefLink` and `EnriryRefLinks` into the underling
  `Link`.
- 5c2e2863f: Added the proper type parameters to entityRouteRef.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [1407b34c6]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/catalog-model@0.7.2

## 0.0.4

### Patch Changes

- d34d26125: Limit the props that are forwarded to the `Link` component in the `EntityRefLink`.
- 0af242b6d: Introduce new cards to `@backstage/plugin-catalog` that can be added to entity pages:

  - `EntityHasSystemsCard` to display systems of a domain.
  - `EntityHasComponentsCard` to display components of a system.
  - `EntityHasSubcomponentsCard` to display subcomponents of a subcomponent.
  - In addition, `EntityHasApisCard` to display APIs of a system is added to `@backstage/plugin-api-docs`.

  `@backstage/plugin-catalog-react` now provides an `EntityTable` to build own cards for entities.
  The styling of the tables and new cards was also applied to the existing `EntityConsumedApisCard`,
  `EntityConsumingComponentsCard`, `EntityProvidedApisCard`, and `EntityProvidingComponentsCard`.

- 10a0124e0: Expose `useRelatedEntities` from `@backstage/plugin-catalog-react` to retrieve
  entities references via relations from the API.
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2

## 0.0.3

### Patch Changes

- 19d354c78: Make `EntityRefLink` a `React.forwardRef` in order to use it as root component in other components like `ListItem`.
- Updated dependencies [6ed2b47d6]
- Updated dependencies [72b96e880]
- Updated dependencies [b51ee6ece]
  - @backstage/catalog-client@0.3.6
  - @backstage/core@0.6.1

## 0.0.2

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/catalog-model@0.7.1
