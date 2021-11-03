# @backstage/plugin-catalog-react

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
