# @backstage/plugin-catalog

## 1.3.0

### Minor Changes

- fe7614ea54: Add an optional icon to the Catalog and TechDocs search results

### Patch Changes

- 449dcef98e: Updates the `isKind`, `ìsComponentType`, and `isNamespace` to allow an array of possible values
- 1f70704580: Accessibility updates:

  - Added screen reader elements to describe default table `Action` buttons

- 915700f64f: In order to simplify analytics on top of the search experience in Backstage, the provided `<*ResultListItem />` component now captures a `discover` analytics event instead of a `click` event. This event includes the result rank as its `value` and, like a click, the URL/path clicked to as its `to` attribute.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/plugin-search-common@0.3.5
  - @backstage/plugin-search-react@0.2.1
  - @backstage/plugin-catalog-common@1.0.3
  - @backstage/core-components@0.9.5
  - @backstage/catalog-client@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/integration-react@1.1.1
  - @backstage/catalog-model@1.0.3

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/integration-react@1.1.1-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/plugin-search-react@0.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0

## 1.2.1-next.0

### Patch Changes

- 449dcef98e: Updates the `isKind`, `ìsComponentType`, and `isNamespace` to allow an array of possible values
- 1f70704580: Accessibility updates:

  - Added screen reader elements to describe default table `Action` buttons

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0
  - @backstage/integration-react@1.1.1-next.0

## 1.2.0

### Minor Changes

- 4274844a8c: Use InfoCardVariants on custom cards variant attribute
- ceca63d149: Added the prop `NotFoundComponent` to `EntityLayout` which can be used to include a custom component when an entity is not found in the catalog

### Patch Changes

- 051fc60258: Lighthouse was reporting this button as having invalid aria- values, as the popover doesn't exist until clicked. This adds additional labels to the button to make it valid aria
- 2bcb0a0e2b: Sidebar NAV now includes aria-label. Component AboutField now uses h2 variant instead of subtitle2 (font properties unchanged)
- 3a74e203a8: Updated search result components to support rendering content with highlighted matched terms
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/integration-react@1.1.0
  - @backstage/plugin-search-react@0.2.0
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-catalog-common@1.0.2

## 1.2.0-next.2

### Patch Changes

- 2bcb0a0e2b: Sidebar NAV now includes aria-label. Component AboutField now uses h2 variant instead of subtitle2 (font properties unchanged)
- 3a74e203a8: Updated search result components to support rendering content with highlighted matched terms
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-search-react@0.2.0-next.2
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/integration-react@1.1.0-next.2
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.2-next.0

## 1.2.0-next.1

### Patch Changes

- 051fc60258: Lighthouse was reporting this button as having invalid aria- values, as the popover doesn't exist until clicked. This adds additional labels to the button to make it valid aria
- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1
  - @backstage/integration-react@1.1.0-next.1

## 1.2.0-next.0

### Minor Changes

- 4274844a8c: Use InfoCardVariants on custom cards variant attribute
- ceca63d149: Added the prop `NotFoundComponent` to `EntityLayout` which can be used to include a custom component when an entity is not found in the catalog

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0
  - @backstage/integration-react@1.1.0-next.0

## 1.1.0

### Minor Changes

- bdc61b4002: Expose 'initalFilter' through initialKind prop on Catalog Page.

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 2a3cac4c60: Corrected replacements for depreciated FilteredEntityLayout items
- f6d2694092: Added tableOptions property to CatalogTable and DefaultCatalogPage to support customization of the Catalog Table. Related issue #10453
- 5d5fdbe541: Columns in CatalogTable now change depending on the entity kind, ensuring only relevant columns are displayed.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/integration-react@1.0.1
  - @backstage/plugin-search-common@0.3.3
  - @backstage/plugin-catalog-common@1.0.1
  - @backstage/catalog-client@1.0.1

## 1.1.0-next.3

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/integration-react@1.0.1-next.2
  - @backstage/plugin-catalog-react@1.0.1-next.3

## 1.1.0-next.2

### Patch Changes

- f6d2694092: Added tableOptions property to CatalogTable and DefaultCatalogPage to support customization of the Catalog Table. Related issue #10453
- 5d5fdbe541: Columns in CatalogTable now change depending on the entity kind, ensuring only relevant columns are displayed.
- Updated dependencies
  - @backstage/core-components@0.9.3-next.1
  - @backstage/plugin-catalog-react@1.0.1-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 1.1.0-next.1

### Minor Changes

- bdc61b4002: Expose 'initalFilter' through initialKind prop on Catalog Page.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1-next.1
  - @backstage/plugin-catalog-common@1.0.1-next.1
  - @backstage/integration-react@1.0.1-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 1.0.1-next.0

### Patch Changes

- 2a3cac4c60: Corrected replacements for depreciated FilteredEntityLayout items
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/integration-react@1.0.1-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- c689d7a94c: **DEPRECATION**: The `FilteredEntityLayout` and related components have been moved to `@backstage/plugin-catalog-react` and renamed. The original components are now deprecated and should be replaced as follows:

  - `FilteredEntityLayout` -> `CatalogFilterLayout`
  - `FilterContainer` -> `CatalogFilterLayout.Filters`
  - `EntityListContainer` -> `CatalogFilterLayout.Content`

- d4afa7e30d: Fix for `EntitySwitch` not properly falling back to render the default entity page when the entity is missing.
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/integration-react@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.0
  - @backstage/plugin-search-common@0.3.2

## 0.10.0

### Minor Changes

- 51856359bf: **BREAKING**: Removed the `AboutCard` component which has been replaced by `EntityAboutCard`.
- 5ea9509e6a: **BREAKING**: Removed `CatalogResultListItemProps` and `CatalogResultListItem`, replaced by `CatalogSearchResultListItemProps` and `CatalogSearchResultListItem`.

### Patch Changes

- 9a06d18385: Added an `allowedKinds` option to `CatalogKindHeader` to limit entity kinds available in the dropdown.
- 251688a75e: Updated `CatalogKindHeader` to respond to external changes to query parameters in the URL, such as two sidebar links that apply different catalog filters.
- 9844d4d2bd: Removed usage of removed hook.
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-catalog-common@0.2.2
  - @backstage/plugin-search-common@0.3.1
  - @backstage/catalog-client@0.9.0
  - @backstage/integration-react@0.1.25

## 0.10.0-next.0

### Minor Changes

- 51856359bf: **BREAKING**: Removed the `AboutCard` component which has been replaced by `EntityAboutCard`.
- 5ea9509e6a: **BREAKING**: Removed `CatalogResultListItemProps` and `CatalogResultListItem`, replaced by `CatalogSearchResultListItemProps` and `CatalogSearchResultListItem`.

### Patch Changes

- 251688a75e: Updated `CatalogKindHeader` to respond to external changes to query parameters in the URL, such as two sidebar links that apply different catalog filters.
- 9844d4d2bd: Removed usage of removed hook.
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-catalog-common@0.2.2-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/integration-react@0.1.25-next.0

## 0.9.1

### Patch Changes

- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- f41a293231: - **DEPRECATION**: Deprecated `formatEntityRefTitle` in favor of the new `humanizeEntityRef` method instead. Please migrate to using the new method instead.
- f590d1681b: Removed usage of deprecated favorite utility methods.
- 44403296e7: Added the following deprecations to the `catalog-react` package:

  - **DEPRECATION**: `useEntity` will now warn if the entity has not yet been loaded, and will soon throw errors instead. If you're using the default implementation of `EntityLayout` and `EntitySwitch` then these components will ensure that there is an entity loaded before rendering children. If you're implementing your own `EntityLayout` or `EntitySwitch` or something that operates outside or adjacent to them, then use `useAsyncEntity`.

  - **DEPRECATION**: the `loading`, `error` and `refresh` properties that are returned from `useEntity` have been deprecated, and are available on `useAsyncEntity` instead.

- da79aac2a6: - Replaced usage of the deprecated and now removed `rootRoute` and `catalogRouteRef`s from the `catalog-react` package
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- 8f0e8e039b: Removed usage of deprecated `getEntityMetadataViewUrl` and `getEntityMetadataEditUrl` helpers.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/plugin-catalog-common@0.2.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/search-common@0.3.0
  - @backstage/integration-react@0.1.24

## 0.9.0

### Minor Changes

- e7b9c3d713: Removed `columnFactories`, which was accidentally exported on the previous release.
- 2262fe19c9: **BREAKING**: Removed support for passing in an explicit `entity` prop to entity page extensions, which has been deprecated for a long time. This is only a breaking change at the TypeScript level, as this property was already ignored.
- 3c4376e5e7: **BREAKING**: Removed the old `plugin` export, use `catalogPlugin` instead.

### Patch Changes

- 2d339b5f2c: Internalize deprecated `useEntityFromUrl` hook
- a686702dbe: Renamed `CatalogResultListItem` to `CatalogSearchResultListItem` along with its prop type, leaving the old names in place as a deprecations.
- 852d5ff758: Added `EntitySwitchProps` type for `EntitySwitch`.
- a8331830f1: Remove use of deprecated `useEntityKinds` hook.
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- b776ce5aab: Replaced use of deprecated `useEntityListProvider` hook with `useEntityList`.
- 3334ad47d4: Removed usage of `EntityContext`.
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/core-plugin-api@0.7.0
  - @backstage/integration-react@0.1.23

## 0.8.0

### Minor Changes

- ae7edbea45: Removed `CatalogClientWrapper` as usage have been replaced by the `fetchApiRef`.
- 37092662cb: **BREAKING** Completely removed the `EntitySystemDiagramCard` component which was deprecated in a previous release. Any remaining references to this component are now broken and should be replaced with `EntityCatalogGraphCard`, which can be imported from package `@backstage/plugin-catalog-graph`.
- 7657eeae22: Removed deprecated `Router` and `EntityPageLayout` exports.
  `Router` is replaced by plugin extensions and `EntityPageLayout` is replaced by `CatalogEntityPage`.
- 0a033351be: **BREAKING**:

  - The `CatalogResultListItem` `result` prop is now of the more narrow and correct type `IndexableDocument`, rather than `any`.
  - The individual table column factories (e.g. `createNameColumn`) are now no longer available directly, but only through `CatalogTable.columns`.

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- 0d03e42a89: Replaced use of deprecated `compareEntityToRef` utility.
- 244d24ebc4: Import `Location` from the `@backstage/catalog-client` package.
- deaf6065db: Adapt to the new `CatalogApi.getLocationByRef`
- 27eccab216: Replaces use of deprecated catalog-model constants.
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/catalog-client@0.7.0
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/errors@0.2.1
  - @backstage/integration-react@0.1.22
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/search-common@0.2.3
  - @backstage/theme@0.2.15
  - @backstage/plugin-catalog-common@0.1.3

## 0.7.12

### Patch Changes

- f8633307c4: Added an "inspect" entry in the entity three-dots menu, for lower level catalog
  insights and debugging.
- 9033775d39: Deprecated the `EntityPageLayout`; please use the new extension based `CatalogEntityPage` instead
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14
  - @backstage/integration-react@0.1.21

## 0.7.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0
  - @backstage/integration-react@0.1.21-next.0

## 0.7.11

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13
  - @backstage/plugin-catalog-common@0.1.2
  - @backstage/integration-react@0.1.20

## 0.7.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.1
  - @backstage/plugin-catalog-react@0.6.13-next.1
  - @backstage/plugin-catalog-common@0.1.2-next.0

## 0.7.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/integration-react@0.1.20-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.7.10

### Patch Changes

- aac316279f: Deprecated `EntitySystemDiagramCard`
  `EntitySystemDiagramCard` is replaced by `EntityCatalogGraphCard` which is imported from `@backstage/plugin-catalog-graph`. This component will be removed in an upcoming release
- Updated dependencies
  - @backstage/core-components@0.8.6

## 0.7.9

### Patch Changes

- 7ba416be78: **@backstage/plugin-user-settings:** Hide Header on mobile screens to improve the UI & give more space to the content. Furthermore, the "Pin Sidebar" setting is removed on mobile screens, as the mobile sidebar is always pinned to the bottom.

  **Other plugins:** Smaller style adjustments across plugins to improve the UI on mobile devices.

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- c54c0d9d10: Add permission check to unregister entity button

  If the permissions framework is disabled, this change should have no effect. If the permission framework is enabled, the unregister entity button will be disabled for those who do not have access to the `catalogEntityDeletePermission` as specified in your permission policy.

- 61ded2a863: Export the `RelatedEntitiesCard` component which is helpful in case you want to model custom relations between entities
- 2b27e49eb1: Internal update to match status field changes in `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/plugin-catalog-common@0.1.1
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5
  - @backstage/integration-react@0.1.19

## 0.7.9-next.0

### Patch Changes

- 7ba416be78: **@backstage/plugin-user-settings:** Hide Header on mobile screens to improve the UI & give more space to the content. Furthermore, the "Pin Sidebar" setting is removed on mobile screens, as the mobile sidebar is always pinned to the bottom.

  **Other plugins:** Smaller style adjustments across plugins to improve the UI on mobile devices.

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- 2b27e49eb1: Internal update to match status field changes in `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/integration-react@0.1.19-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.7.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/integration-react@0.1.18

## 0.7.7

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- 11b81683a9: Support customizing index page layouts via outlets
- e195390974: Allow entities from `file` locations to be manually refreshed through the UI
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3

## 0.7.6

### Patch Changes

- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.9
  - @backstage/integration-react@0.1.17

## 0.7.5

### Patch Changes

- 3fa31ec84a: Deprecated the `CatalogClientWrapper` class.

  The default implementation of `catalogApiRef` that this plugin exposes, is now powered by the new `fetchApiRef`. The default implementation of _that_ API, in turn, has the ability to inject the user's Backstage token in requests in a similar manner to what the deprecated `CatalogClientWrapper` used to do. The latter has therefore been taken out of the default catalog API implementation.

  If you use a custom `fetchApiRef` implementation that does NOT issue tokens, or use a custom `catalogApiRef` implementation which does NOT use the default `fetchApiRef`, you can still for some time wrap your catalog API in this class to get back the old behavior:

  ```ts
  // Add this to your packages/app/src/plugins.ts if you want to get back the old
  // catalog client behavior:
  createApiFactory({
    api: catalogApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
    factory: ({ discoveryApi, identityApi }) =>
      new CatalogClientWrapper({
        client: new CatalogClient({ discoveryApi }),
        identityApi,
      }),
  }),
  ```

  But do consider migrating to making use of the `fetchApiRef` as soon as convenient, since the wrapper class will be removed in a future release.

- 7a4bd2ceac: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2
  - @backstage/catalog-client@0.5.3
  - @backstage/integration-react@0.1.16

## 0.7.4

### Patch Changes

- 9603827bb5: Addressed some peer dependency warnings
- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/integration-react@0.1.15
  - @backstage/plugin-catalog-react@0.6.5

## 0.7.3

### Patch Changes

- 38d6df6bb9: Remove the "View Api" icon in the AboutCard, as the information is misleading for some users and is
  duplicated in the tabs above.
- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/integration-react@0.1.14

## 0.7.2

### Patch Changes

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/errors@0.1.3
  - @backstage/core-plugin-api@0.1.11
  - @backstage/plugin-catalog-react@0.6.1
  - @backstage/catalog-model@0.9.5

## 0.7.1

### Patch Changes

- 82fbda923e: Introduce a new `StarredEntitiesApi` that is used in the `useStarredEntities` hook.
  The `@backstage/plugin-catalog` installs a default implementation that is backed by the `StorageApi`, but one can also override the `starredEntitiesApiRef`.

  This change also updates the storage format from a custom string to an entity reference and moves the location in the local storage.
  A migration will convert the previously starred entities to the location on the first load of Backstage.

- 93a13dfb42: Support `material-ui` overrides in SystemDiagramCard and EmptityLinksEmptyState components
- b03b9f19e0: added sorting in entity `Name` column by `metadata.title` if present
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11
  - @backstage/integration-react@0.1.12

## 0.7.0

### Minor Changes

- bb0f6b8a0f: Updates the `<EntitySwitch if={asyncMethod}/>` to accept asynchronous `if` functions.

  Adds the new `getEntityAncestors` method to `CatalogClient`.

  Updates the `<EntityProcessingErrorsPanel />` to make use of the ancestry endpoint to display errors for entities further up the ancestry tree. This makes it easier to discover issues where for example the origin location has been removed or malformed.

  `hasCatalogProcessingErrors()` is now changed to be asynchronous so any calls outside the already established entitySwitch need to be awaited.

### Patch Changes

- 5aae9bb61e: Name column will now render entity `metadata.title` if its present
- 1c5c5b23fb: Replace deprecated material UI components used by LinksCard to remove errors from console log
- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4
  - @backstage/catalog-client@0.5.0

## 0.6.17

### Patch Changes

- dd52fa1c5c: Update AboutCard to only render refresh button if the entity is managed by an url location.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/integration-react@0.1.11
  - @backstage/plugin-catalog-react@0.5.1

## 0.6.16

### Patch Changes

- dbcaa6387a: Updates the `AboutCard` with a refresh button that allows the entity to be scheduled for refresh.
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/integration-react@0.1.10

## 0.6.15

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- e95b379d5f: Deprecated `Router` in favor of using the plugin extensions.
- d5b23612c2: Display entity titles on `EntityLayout` if defined
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/integration@0.6.4
  - @backstage/integration-react@0.1.9
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.6.14

### Patch Changes

- 10db3ce09: Update the `AboutCard` to properly support non-standard entity types and rework the defaults for the build-in kinds.

  This change also uses `useElementFilter(...)` instead of `React.children.count(...)` in `AboutField` to properly recognize whether children are available.

- 7e5f14dda: This change hides pagination counter of search tables and group members list when results fit in one page
- 3ed78fca3: Added the ability to switch entity kind on the catalog index page. This is a non-breaking change, but if you created a custom `CatalogPage` and wish to use this feature, make the modifications shown on [#6895](https://github.com/backstage/backstage/pull/6895).
- aaa1dd17b: Use a `Link` for the edit button on the `AboutCard` instead of doing `window.open(...)`
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/integration@0.6.3
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1
  - @backstage/integration-react@0.1.8

## 0.6.13

### Patch Changes

- 787bc0826: **NOTE**: The entity `<AboutCard />` now uses an external route ref to link to
  TechDocs sites. This external route must now be bound in order for the "View
  TechDocs" link to continue working. See the [create-app changelog][cacl] for
  details.

  [cacl]: https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md

- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.4
  - @backstage/core-components@0.3.3
  - @backstage/integration@0.6.2

## 0.6.12

### Patch Changes

- fa1e003e0: Show a Not Found message when navigating to a nonexistent entity
- 2105d608f: Migrate and export `UnregisterEntityDialog` component from `catalog-react` package
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.3
  - @backstage/core-components@0.3.2
  - @backstage/integration@0.6.1
  - @backstage/theme@0.2.10

## 0.6.11

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- a440d3b38: Move and rename `FavoriteEntity` component to `catalog-react`
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog-react@0.4.2
  - @backstage/integration-react@0.1.7

## 0.6.10

### Patch Changes

- cf4635f93: Fix bug with re-rendering the EntityRoutes when the entity changes but the route does not
- 7b8aa8d0d: Move the `CreateComponentButton` from the catalog plugin to the `core-components` & rename it to `CreateButton` to be reused inside the api-docs plugin & scaffolder plugin, but also future plugins. Additionally, improve responsiveness of `CreateButton` & `SupportButton` by shrinking them to `IconButtons` on smaller screens.
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9
  - @backstage/integration-react@0.1.6
  - @backstage/plugin-catalog-react@0.4.1

## 0.6.9

### Patch Changes

- 19d9995b6: Improve accessibility of core & catalog components by adjusting them with non-breaking changes.
- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- 224e54484: Added an `EntityProcessingErrorsPanel` component to show any errors that occurred when refreshing an entity from its source location.

  If upgrading, this should be added to your `EntityPage` in your Backstage application:

  ```diff
  // packages/app/src/components/catalog/EntityPage.tsx

  const overviewContent = (
  ...
            <EntityOrphanWarning />
          </Grid>
         </EntitySwitch.Case>
      </EntitySwitch>
  +   <EntitySwitch>
  +     <EntitySwitch.Case if={hasCatalogProcessingErrors}>
  +       <Grid item xs={12}>
  +         <EntityProcessingErrorsPanel />
  +       </Grid>
  +     </EntitySwitch.Case>
  +   </EntitySwitch>

  ```

  Additionally, `WarningPanel` now changes color based on the provided severity.

- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/integration-react@0.1.5
  - @backstage/theme@0.2.9
  - @backstage/catalog-client@0.3.18

## 0.6.8

### Patch Changes

- 221d7d060: added retry callback to useEntity hook
- 45b5fc3a8: Updated the layout of catalog and API index pages to handle smaller screen sizes. This adds responsive wrappers to the entity tables, and switches filters to a drawer when width-constrained. If you have created a custom catalog or API index page, you will need to update the page structure to match the updated [catalog customization](https://backstage.io/docs/features/software-catalog/catalog-customization) documentation.
- 71c936eb6: Export `CatalogClientWrapper` class
- 03bf17e9b: Improve the responsiveness of the EntityPage UI. With this the Header component should scale with the screen size & wrapping should not cause overflowing/blocking of links. Additionally enforce the Pages using the Grid Layout to use it across all screen sizes & to wrap as intended.

  To benefit from the improved responsive layout, the `EntityPage` in existing Backstage applications should be updated to set the `xs` column size on each grid item in the page, as this does not default. For example:

  ```diff
  -  <Grid item md={6}>
  +  <Grid item xs={12} md={6}>
  ```

- Updated dependencies
  - @backstage/core-components@0.1.6
  - @backstage/catalog-client@0.3.17
  - @backstage/plugin-catalog-react@0.3.1

## 0.6.7

### Patch Changes

- 75a532fbe: Add unstable prop for disabling unregister entity menu
- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.6.6

### Patch Changes

- ad5d05b69: Change catalog page layout to use Grid components to improve responsiveness
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/catalog-client@0.3.16
  - @backstage/plugin-catalog-react@0.2.6

## 0.6.5

### Patch Changes

- f423891ee: Fixed sizing of the System diagram when the rendered graph was wider than the container.
- e19283b39: Get rid of flex console warning for IconLink
- Updated dependencies
  - @backstage/plugin-catalog-react@0.2.5
  - @backstage/core-components@0.1.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.6.4

### Patch Changes

- bba9df7f9: improve the wrapping behavior of long entity links
- 5f4339b8c: Adding `FeatureFlag` component and treating `FeatureFlags` as first class citizens to composability API
- 7bd46b19d: Allow `defaultKind` from `CatalogTable.column.creatNameColumn` to be configurable
- 71416fb64: Moved installation instructions from the main [backstage.io](https://backstage.io) documentation to the package README file. These instructions are not generally needed, since the plugin comes installed by default with `npx @backstage/create-app`.
- e3cbfa8c2: Disambiguated titles of `EntityDependencyOfComponentsCard` and `EntityDependsOnComponentsCard`.
- 3d7b1c9f0: Adds an optional `actions` prop to `CatalogTable` and `CatalogPage` to support supplying custom actions for each entity row in the table. This uses the default actions if not provided.
- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- 80a82ffce: Clearer titles for the relationship cards
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4
  - @backstage/integration-react@0.1.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.6.3

### Patch Changes

- 30c2fdad2: Exports `CatalogLayout` and `CreateComponentButton` for catalog customization.
- e2d68f1ce: Truncate long entity names on the system diagram
- d2d42a7fa: Fix for Diagram component using hard coded namespace.
- 2ebc430c4: Export `CatalogTableRow` type
- Updated dependencies
  - @backstage/plugin-catalog-react@0.2.3
  - @backstage/catalog-model@0.8.3
  - @backstage/core@0.7.13

## 0.6.2

### Patch Changes

- db1c8f93b: A `<CatalogResultListItem />` component is now available for use in custom Search Experiences.
- f4e3ac5ce: Move `ScmIntegrationIcon` from `@backstage/plugin-catalog` to
  `@backstage/integration-react` and make it customizable using
  `app.getSystemIcon()`.
- 7028ee1ca: Expose `getEntitySourceLocation`, `getEntityMetadataViewUrl`, and
  `getEntityMetadataEditUrl` from `@backstage/plugin-catalog-react`.
- 4fbb00707: A new card that shows components that depend on the active component
- d5ad47bbb: Exported AboutCard contents and utility functions
- Updated dependencies [27a9b503a]
- Updated dependencies [f4e3ac5ce]
- Updated dependencies [7028ee1ca]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/catalog-model@0.8.2
  - @backstage/integration-react@0.1.3
  - @backstage/plugin-catalog-react@0.2.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.6.1

### Patch Changes

- 2a942cc9e: invert logic for when to show type column
- f46a9e82d: Move dependency to `@microsoft/microsoft-graph-types` from `@backstage/plugin-catalog`
  to `@backstage/plugin-catalog-backend`.
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
- Updated dependencies [1cf1d351f]
- Updated dependencies [deaba2e13]
- Updated dependencies [8e919a6f8]
  - @backstage/theme@0.2.8
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5
  - @backstage/core@0.7.12
  - @backstage/plugin-catalog-react@0.2.1

## 0.6.0

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

- 7ab5bfe68: Add support for fullHeight variant to the AboutCard
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.5.8

### Patch Changes

- a53f3d603: - Added `RelatedEntitesCard` as a base implementation of displaying entities that are related to another entity.
  - Added `HasResourcesCard` to display resources that are part of a system.
  - Added `DependsOnComponentsCard` to display components that are dependencies of a component.
  - Added `DependsOnResourcesCard` to display resources that are dependencies of a component.
  - Refactored `HasComponentsCard` to use base `RelatedEntitiesCard`. Card remains backwards compatible.
  - Refactored `HasSubcomponentsCard` to use base `RelatedEntitiesCard`. Card remains backwards compatible.
  - Refactored `HasSystemsCard` to use base `RelatedEntitiesCard`. Card remains backwards compatible.
  - Updated the example app to take advantage of these new components.
- b203699e9: Display warning when Entity has orphan annotation.
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3

## 0.5.7

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 5542de095: This makes the CatalogTable configurable with custom columns, passed through the CatalogPage component rendered on the home page.
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.5.6

### Patch Changes

- 19a4dd710: Removed unused `swr` dependency.
- da546ce00: Support `gridItem` variant for `EntityLinksCard`.
- e0c9ed759: Add `if` prop to `EntityLayout.Route` to conditionally render tabs
- 1a142ae8a: Switch out the time-based personal greeting for a plain title on the catalog index page, and remove the clocks for different timezones.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.5.5

### Patch Changes

- 96728a2af: SystemDiagramCard UI improvements
- 87c4f59de: Add low german greeting
- Updated dependencies [94da20976]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [931b21a12]
- Updated dependencies [937ed39ce]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/theme@0.2.6

## 0.5.4

### Patch Changes

- 5d0740563: Implemented missing support for the dependsOn/dependencyOf relationships
  between `Component` and `Resource` catalog model objects.

  Added support for generating the relevant relationships to the
  `BuiltinKindsEntityProcessor`, and added simple support for fetching
  relationships between `Components` and `Resources` for rendering in the
  system diagram. All catalog-model changes backwards compatible.

- Updated dependencies [bb5055aee]
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5d0740563]
- Updated dependencies [5cafcf452]
- Updated dependencies [86a95ba67]
- Updated dependencies [442f34b87]
- Updated dependencies [e27cb6c45]
  - @backstage/catalog-model@0.7.7
  - @backstage/core@0.7.5
  - @backstage/catalog-client@0.3.10

## 0.5.3

### Patch Changes

- 98dd5da71: Add support for multiple links to post-scaffold task summary page
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [97b60de98]
- Updated dependencies [b051e770c]
- Updated dependencies [98dd5da71]
  - @backstage/core@0.7.4
  - @backstage/catalog-model@0.7.6

## 0.5.2

### Patch Changes

- aa58c01e2: Adds a new `EntitySystemDiagramCard` component to visually map all elements in a system.

  To use this new component with the legacy composability pattern, you can add a new tab with the component on to the System Entity Page in your `packages/app/src/components/catalog/EntityPage.tsx` file.

  For example,

  ```diff
   const SystemEntityPage = ({ entity }: { entity: Entity }) => (
     <EntityPageLayoutWrapper>
       <EntityPageLayout.Content
         path="/*"
         title="Overview"
         element={<SystemOverviewContent entity={entity} />}
       />
  +    <EntityPageLayout.Content
  +      path="/diagram/*"
  +      title="Diagram"
  +      element={<EntitySystemDiagramCard />}
  +    />
     </EntityPageLayoutWrapper>
   );
  ```

- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- 8bee6a131: unify how the owner and lifecycle header labels are made
- 676ede643: Improve the unregister dialog, to support both unregistration and plain deletion
- Updated dependencies [676ede643]
- Updated dependencies [9f48b548c]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
  - @backstage/catalog-client@0.3.9
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.5.1

### Patch Changes

- 4d248725e: Temporarily add `UNSTABLE_extraContextMenuItems` to the entity layout, so that we could detach the catalog plugin from the dependency on the badges plugin
- 687f066e1: Add icon for entity badge menu
- Updated dependencies [01ccef4c7]
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/plugin-catalog-react@0.1.3
  - @backstage/core@0.7.3
  - @backstage/theme@0.2.5

## 0.5.0

### Minor Changes

- 3385b374b: Use `scmIntegrationsApiRef` from the new `@backstage/integration-react`.

### Patch Changes

- 633a31fec: Add the ability to change the initially selected filter, if not set it still defaults to `owned`.

  ```js
  <Route
    path="/catalog"
    element={<CatalogIndexPage initiallySelectedFilter="all" />}
  />
  ```

- 9ca0e4009: use local version of lowerCase and upperCase methods
- 8686eb38c: Use errors from `@backstage/errors`
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/catalog-client@0.3.8
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.4.2

### Patch Changes

- 4f3d0dce0: This is a quick fix (while #2791 is being implemented) to make it possible view non well known component types listed in the catalog index page. It buckets any component entities that are not a `service`, `library`, or `documentation` into the `Other` tab. It also displays a `Type` column when on Other tab.
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- 9f7dc10fb: Show a Not Found message when navigating to a nonexistent entity
- 93c62c755: Move logic for generating URLs for the view, edit and source links of catalog
  entities from the catalog frontend into the backend. This is done using the
  existing support for the `backstage.io/view-url`, `backstage.io/edit-url` and
  `backstage.io/source-location` annotations that are now filled by the
  `AnnotateLocationEntityProcessor`. If these annotations are missing or empty,
  the UI disables the related controls.
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [ff4d666ab]
- Updated dependencies [905cbfc96]
- Updated dependencies [2089de76b]
- Updated dependencies [d4e77ec5f]
- Updated dependencies [dc1fc92c8]
  - @backstage/integration@0.5.1
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.4.1

### Patch Changes

- 32a003973: Update messaging when no entities are in a table.
- 40c0fdbaa: Make the external `createComponent` route optional, hiding the "Create Component" button if it isn't bound.
- 10362e9eb: Use entity relation for the owner of an entity in the catalog entity page header.
- b33e553b2: Removed fullScreen property from UnregisterEntity Dialog modal.
- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.4.0

### Minor Changes

- a5f42cf66: The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

  The page is imported from the Scaffolder plugin and added to the `<FlatRoutes>` component:

  ```tsx
  <Route path="/create" element={<ScaffolderPage />} />
  ```

  The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

  To use the new extension components, replace existing usage of the `CatalogRouter` with the following:

  ```tsx
  <Route path="/catalog" element={<CatalogIndexPage />} />
  <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
    <EntityPage />
  </Route>
  ```

  And to bind the external route from the catalog plugin to the scaffolder template index page, make sure you have the appropriate imports and add the following to the `createApp` call:

  ```ts
  import { catalogPlugin } from '@backstage/plugin-catalog';
  import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
      });
    },
  });
  ```

- d0760ecdf: Moved common useStarredEntities hook to plugin-catalog-react

### Patch Changes

- d6593abe6: Remove domain column from `HasSystemsCard` and system from `HasComponentsCard`,
  `HasSubcomponentsCard`, and `HasApisCard`.
- bad21a085: Implement annotations for customising Entity URLs in the Catalog pages.
- 437bac549: Make the description column in the catalog table and api-docs table use up as
  much space as possible before hiding overflowing text.
- 5469a9761: Changes made in CatalogTable and ApiExplorerTable for using the OverflowTooltip component for truncating large description and showing tooltip on hover-over.
- 60d1bc3e7: Fix Japanese Good Morning
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.3.2

### Patch Changes

- 32a950409: Hide the kind of the owner if it's the default kind for the `ownedBy`
  relationship (group).
- f10950bd2: Minor refactoring of BackstageApp.getSystemIcons to support custom registered
  icons. Custom Icons can be added using:

  ```tsx
  import AlarmIcon from '@material-ui/icons/Alarm';
  import MyPersonIcon from './MyPerson';

  const app = createApp({
    icons: {
      user: MyPersonIcon // override system icon
      alert: AlarmIcon, // Custom icon
    },
  });
  ```

- 914c89b13: Remove the "Move repository" menu entry from the catalog page, as it's just a placeholder.
- 0af242b6d: Introduce new cards to `@backstage/plugin-catalog` that can be added to entity pages:

  - `EntityHasSystemsCard` to display systems of a domain.
  - `EntityHasComponentsCard` to display components of a system.
  - `EntityHasSubcomponentsCard` to display subcomponents of a subcomponent.
  - In addition, `EntityHasApisCard` to display APIs of a system is added to `@backstage/plugin-api-docs`.

  `@backstage/plugin-catalog-react` now provides an `EntityTable` to build own cards for entities.
  The styling of the tables and new cards was also applied to the existing `EntityConsumedApisCard`,
  `EntityConsumingComponentsCard`, `EntityProvidedApisCard`, and `EntityProvidingComponentsCard`.

- f4c2bcf54: Use a more strict type for `variant` of cards.
- 53b69236d: Migrate about card to new composability API, exporting the entity cards as `EntityAboutCard`.
- Updated dependencies [6c4a76c59]
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/plugin-scaffolder@0.5.1
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.3.1

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- ca559171b: bug fix: 3310 fixes reloading entities with the default owned filter
- f5e564cd6: Improve display of error messages
- 1df75733e: Adds an `EntityLinksCard` component to display `entity.metadata.links` on entity pages. The new component is a companion for the new [Entity Links](https://backstage.io/docs/features/software-catalog/descriptor-format#links-optional) catalog model addition.

  Here is an example usage within an `EntityPage.tsx`.

  ```tsx
  // in packages/app/src/components/catalog/EntityPage.tsx
  const ComponentOverviewContent = ({ entity }: { entity: Entity }) => (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={4} sm={6}>
        <EntityLinksCard />
        // or ...
        <EntityLinksCard cols={{ md: 2, lg: 3, xl: 4 }} />
      </Grid>
    </Grid>
  );
  ```

- e5da858d7: Removed unused functions and the moment library. #4278
- 9230d07e7: Fix whitespace around variable in unregister error dialog box
- Updated dependencies [6ed2b47d6]
- Updated dependencies [72b96e880]
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/catalog-client@0.3.6
  - @backstage/plugin-scaffolder@0.5.0
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.3.0

### Minor Changes

- 019fe39a0: `@backstage/plugin-catalog` stopped exporting hooks and helpers for other
  plugins. They are migrated to `@backstage/plugin-catalog-react`.
  Change both your dependencies and imports to the new package.

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- b37501a3d: Add `children` option to `addPage`, which will be rendered as the children of the `Route`.
- b37501a3d: Finalize migration to new composability API, with the plugin instance now exported `catalogPlugin`.
- 54c7d02f7: Introduce `TabbedLayout` for creating tabs that are routed.

  ```typescript
  <TabbedLayout>
    <TabbedLayout.Route path="/example" title="Example tab">
      <div>This is rendered under /example/anything-here route</div>
    </TabbedLayout.Route>
  </TabbedLayout>
  ```

- Updated dependencies [720149854]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [019fe39a0]
- Updated dependencies [11cb5ef94]
  - @backstage/plugin-scaffolder@0.4.2
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.2.14

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- 0b1182346: Add `EntityRefLinks` that shows one or multiple entity ref links.

  Change the about card and catalog table to use `EntityRefLinks` due to the
  nature of relations to support multiple relations per type.

- Updated dependencies [9dd057662]
  - @backstage/plugin-scaffolder@0.4.1

## 0.2.13

### Patch Changes

- a4e636c8f: Hide the kind of owners in the about card if it's the default kind (group)
- 099c5cf4f: Show the parent component in the about card (via partOf relationship)
- a08db734c: Remove the `WelcomeBanner` that links to a plugin that is not longer wired into Backstage instances

## 0.2.12

### Patch Changes

- 593632f07: Derive the list of to-delete entities in the `UnregisterEntityDialog` from the `backstage.io/managed-by-origin-location` annotation.
  The dialog also rejects deleting entities that are created by the `bootstrap:bootstrap` location.
- 33846acfc: Display the owner, system, and domain as links to the entity pages in the about card.
  Only display fields in the about card that are applicable to the entity kind.
- f04db53d7: Display systems in catalog table and make both owner and system link to the entity pages.
  The owner field is now taken from the relations of the entity instead of its spec.
- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
- Updated dependencies [ed6baab66]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-scaffolder@0.4.0
  - @backstage/catalog-client@0.3.5

## 0.2.11

### Patch Changes

- c00488983: Enable catalog table actions for all location types.

  The edit button has had support for other providers for a while and there is
  no specific reason the View in GitHub cannot work for all locations. This
  change also replaces the GitHub icon with the OpenInNew icon.

- Updated dependencies [f3b064e1c]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/core@0.4.4

## 0.2.10

### Patch Changes

- 9c09a364f: Remove the unused dependency to `@backstage/plugin-techdocs`.
- Updated dependencies [8e083f41f]
- Updated dependencies [947d3c269]
  - @backstage/plugin-scaffolder@0.3.6

## 0.2.9

### Patch Changes

- 7e0b8cac5: Add `CatalogIndexPage` and `CatalogEntityPage`, two new extensions that replace the existing `Router` component.

  Add `EntityLayout` to replace `EntityPageLayout`, using children instead of an element property, and allowing for collection of all `RouteRef` mount points used within tabs.

  Add `EntitySwitch` to be used to select components based on entity data, along with accompanying `isKind`, `isNamespace`, and `isComponentType` filters.

- 87c0c53c2: Add new `EntityProvider` component, which can be used to provide an entity for the `useEntity` hook.
- Updated dependencies [a08c32ced]
- Updated dependencies [359f9d2d8]
  - @backstage/core@0.4.3
  - @backstage/plugin-techdocs@0.5.2

## 0.2.8

### Patch Changes

- 342270e4d: Create AboutCard in core and use it in pagerduty and catalog plugin
- Updated dependencies [19554f6d6]
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
  - @backstage/plugin-scaffolder@0.3.5
  - @backstage/core@0.4.2
  - @backstage/plugin-techdocs@0.5.1

## 0.2.7

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [dae4f3983]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/plugin-techdocs@0.5.0
  - @backstage/core@0.4.1
  - @backstage/catalog-client@0.3.4
  - @backstage/plugin-scaffolder@0.3.4

## 0.2.6

### Patch Changes

- 6011b7d3e: Added pagerduty plugin to example app
- Updated dependencies [2527628e1]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [87a33d2fe]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/catalog-model@0.5.0
  - @backstage/plugin-techdocs@0.4.0
  - @backstage/theme@0.2.2
  - @backstage/plugin-scaffolder@0.3.3
  - @backstage/catalog-client@0.3.3

## 0.2.5

### Patch Changes

- ebf37bbae: Use the OWNED_BY relation and compare it to the users MEMBER_OF relation. The user entity is searched by name, based on the userId of the identity.
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [da2ad65cb]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-scaffolder@0.3.2
  - @backstage/plugin-techdocs@0.3.1
  - @backstage/catalog-client@0.3.2

## 0.2.4

### Patch Changes

- 6f70ed7a9: Replace usage of implementsApis with relations
- Updated dependencies [4b53294a6]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
  - @backstage/plugin-techdocs@0.3.0
  - @backstage/catalog-model@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [ef2831dde]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-scaffolder@0.3.1
  - @backstage/catalog-client@0.3.1
  - @backstage/plugin-techdocs@0.2.3

## 0.2.2

### Patch Changes

- 8b7737d0b: Add About Card tooltips
- Updated dependencies [1722cb53c]
- Updated dependencies [717e43de1]
  - @backstage/core@0.3.1
  - @backstage/plugin-techdocs@0.2.2
  - @backstage/catalog-client@0.3.0

## 0.2.1

### Patch Changes

- 2d0bd1be7: Improved the edit link to open the component yaml in edit mode in corresponding SCM. Broke out logic for createEditLink to be reused.
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [59166e5ec]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-scaffolder@0.3.0
  - @backstage/plugin-techdocs@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 368fd8243: Created EntityNotFound component for catalog which displays the 404 page when entity is not found.

  Fixes #2266

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

- f0aa01bcc: Add client side paging for catalog table
- 8b9c8196f: Locations registered through the catalog client now default to the 'url' type. The type selection dropdown in the register-component form has been removed.
- 2ebcfac8d: Add a validate button to the register-component page

  This allows the user to validate his location before adding it.

- 0b956f21b: The URL path for a catalog entity has changed,

  - from: `/catalog/:kind/:optionalNamespaceAndName`
  - to: `/catalog/:namespace/:kind/:name`

  Redirects are in place, so disruptions for users should not happen.

### Patch Changes

- 0aecfded0: handle the case where no entities are available to show
- 60d40892c: Remove "in default" in component name
- 97c2cb19b: update the EntityNotFound component
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [8351ad79b]
- Updated dependencies [fb74f1db6]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [c5ef12926]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [1c8c43756]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [57b54c8ed]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-scaffolder@0.2.0
  - @backstage/plugin-techdocs@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
