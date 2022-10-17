# @backstage/catalog-client

## 1.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/errors@1.1.2-next.2

## 1.1.1-next.1

### Patch Changes

- 4f2ac624b4: Renamed argument in `validateEntity` from `location` to `locationRef`
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/errors@1.1.2-next.1

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/errors@1.1.2-next.0

## 1.1.0

### Minor Changes

- 65d1d4343f: Adding `validateEntity` method that calls `/validate-entity` endpoint.

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/catalog-model@1.1.1
  - @backstage/errors@1.1.1

## 1.1.0-next.2

### Minor Changes

- 65d1d4343f: Adding `validateEntity` method that calls `/validate-entity` endpoint.

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/errors@1.1.1-next.0

## 1.0.5-next.1

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.

## 1.0.5-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- ef9ab322de: Minor API signatures cleanup

## 1.0.4

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0
  - @backstage/errors@1.1.0

## 1.0.4-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.3

## 1.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/errors@1.1.0-next.0

## 1.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0

## 1.0.3

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 35bc0a7c27: Update README to point to catalog-react for frontend usage
- Updated dependencies
  - @backstage/catalog-model@1.0.3

## 1.0.3-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/catalog-model@1.0.3-next.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.2

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.2-next.0

## 1.0.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 0163c41be2: **BREAKING**: Removed the deprecated `presence` field in the `Location` and `AddLocationRequest` types. This field was already being ignored by the catalog backend and can be safely removed.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.0
  - @backstage/errors@1.0.0

## 0.9.0

### Minor Changes

- bf95bb806c: **BREAKING**: Removed previously deprecated `CatalogApi.getEntityByName`, please use `getEntityByRef` instead.
- a3eb3d2afa: **BREAKING**: Removed `CatalogClient.getLocationByEntity` and `CatalogClient.getOriginLocationByEntity` which had previously been deprecated. Please use `CatalogApi.getLocationByRef` instead. Note that this only affects you if you were using `CatalogClient` (the class) directly, rather than `CatalogApi` (the interface), since it has been removed from the interface in an earlier release.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0

## 0.9.0-next.0

### Minor Changes

- bf95bb806c: **BREAKING**: Removed previously deprecated `CatalogApi.getEntityByName`, please use `getEntityByRef` instead.
- a3eb3d2afa: **BREAKING**: Removed `CatalogClient.getLocationByEntity` and `CatalogClient.getOriginLocationByEntity` which had previously been deprecated. Please use `CatalogApi.getLocationByRef` instead. Note that this only affects you if you were using `CatalogClient` (the class) directly, rather than `CatalogApi` (the interface), since it has been removed from the interface in an earlier release.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0-next.0

## 0.8.0

### Minor Changes

- bb2ba5f10d: **BREAKING**: Removed the old deprecated request/response types:

  - `CatalogEntitiesRequest` - please use `GetEntitiesRequest` instead
  - `CatalogEntityAncestorsRequest` - please use `GetEntityAncestorsRequest` instead
  - `CatalogEntityAncestorsResponse` - please use `GetEntityAncestorsResponse` instead
  - `CatalogListResponse` - please use `GetEntitiesResponse` instead

### Patch Changes

- a52f69987a: **DEPRECATION**: Deprecated `getEntityByName` from `CatalogApi` and added `getEntityByRef` instead, which accepts both string and compound ref forms.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0

## 0.7.2

### Patch Changes

- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 46dee04eba: Deprecated `AddLocationRequest.presence`, as it is already being ignored.
- 6e1cbc12a6: Added `CatalogApi.getEntityFacets`. Marking this as a breaking change since it
  is a non-optional addition to the API and depends on the backend being in place.
  If you are mocking this interface in your tests, you will need to add an extra
  `getEntityFacets: jest.fn()` or similar to that interface.
- Updated dependencies
  - @backstage/catalog-model@0.11.0

## 0.7.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/catalog-model@0.10.1
  - @backstage/errors@0.2.2

## 0.7.0

### Minor Changes

- 8eda0e7a9c: **BREAKING**: Removed the explicit `DiscoveryApi` and `FetchApi` export symbols,
  which were unnecessary duplicates from the well known core ones.

  The `CATALOG_FILTER_EXISTS` symbol's value has changed. However, this should not
  affect any code in practice.

- deaf6065db: Removed `CatalogApi.geLocationByEntity` and `CatalogApi.getOriginLocationByEntity`, and replaced them with `CatalogApi.getLocationByRef`.

  If you were using one of the two old methods, you can update your code as follows:

  ```diff
  -const originLocation = catalogApi.getOriginLocationByEntity(entity);
  +const originLocation = catalogApi.getLocationByRef(entity.metadata.annotations[ANNOTATION_ORIGIN_LOCATION]!);
  -const location = catalogApi.getLocationByEntity(entity);
  +const location = catalogApi.getLocationByRef(entity.metadata.annotations[ANNOTATION_LOCATION]!);
  ```

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- 244d24ebc4: Export the `Location` type that was previously exported by the `@backstage/catalog-model` package.
- 538ca90790: Deprecated the following types used by the catalog client, and created new
  corresponding types to make them more consistent:

  - `CatalogEntitiesRequest` -> `GetEntitiesRequest`
  - `CatalogListResponse` was removed and generally replaced with `GetEntitiesResponse` (which does not use a type parameter argument)
  - `CatalogEntityAncestorsRequest`-> `GetEntityAncestorsRequest`
  - `CatalogEntityAncestorsResponse` -> `GetEntityAncestorsResponse`

- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0

## 0.6.0

### Minor Changes

- f8633307c4: Fixed the return type of the catalog API `getEntityAncestors`, to match the
  actual server response shape.

  While this technically is a breaking change, the old shape has never worked at
  all if you tried to use it - so treating this as an immediately-shipped breaking
  bug fix.

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10-next.0

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.5.3

### Patch Changes

- 7927005152: Add the ability to supply a custom `fetchApi`. In the default frontend app setup, this will use the `fetchApiRef` implementation.
- 5463c03b35: Add support for passing paging parameters to the getEntities call of the catalog client

## 0.5.2

### Patch Changes

- 3bf2238187: Update to the right version of @backstage/errors
- Updated dependencies
  - @backstage/catalog-model@0.9.7

## 0.5.1

### Patch Changes

- 39e92897e4: Improved API documentation for catalog-client.

## 0.5.0

### Minor Changes

- bb0f6b8a0f: Updates the `<EntitySwitch if={asyncMethod}/>` to accept asynchronous `if` functions.

  Adds the new `getEntityAncestors` method to `CatalogClient`.

  Updates the `<EntityProcessingErrorsPanel />` to make use of the ancestry endpoint to display errors for entities further up the ancestry tree. This makes it easier to discover issues where for example the origin location has been removed or malformed.

  `hasCatalogProcessingErrors()` is now changed to be asynchronous so any calls outside the already established entitySwitch need to be awaited.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.4

## 0.4.0

### Minor Changes

- dbcaa6387a: Extends the `CatalogClient` interface with a `refreshEntity` method.

### Patch Changes

- 9ef2987a83: Update `AddLocationResponse` to optionally return `exists` to signal that the location already exists, this is only returned when calling `addLocation` in dryRun.
- Updated dependencies
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.3.19

### Patch Changes

- d1da88a19: Properly export all used types.
- Updated dependencies
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9

## 0.3.18

### Patch Changes

- 11c370af2: Support filtering entities via property existence

## 0.3.17

### Patch Changes

- 71c936eb6: Export `CatalogRequestOptions` type

## 0.3.16

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0

## 0.3.15

### Patch Changes

- ca080cab8: Don't crash if the entities response doesn't include the entities name and kind

## 0.3.14

### Patch Changes

- 45ef515d0: Return entities sorted alphabetically by ref
- Updated dependencies
  - @backstage/catalog-model@0.8.4

## 0.3.13

### Patch Changes

- 70bc30c5b: Display preview result final step.
- Updated dependencies [27a9b503a]
  - @backstage/catalog-model@0.8.2

## 0.3.12

### Patch Changes

- add62a455: Foundation for standard entity status values
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0

## 0.3.11

### Patch Changes

- d1b1306d9: Allow `filter` parameter to be specified multiple times
- Updated dependencies [d8b81fd28]
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.3.10

### Patch Changes

- 442f34b87: Make sure the `CatalogClient` escapes URL parameters correctly.
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.3.9

### Patch Changes

- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- b196a4569: Avoid using Headers as it is not supported in the backend
- Updated dependencies [8488a1a96]
  - @backstage/catalog-model@0.7.5

## 0.3.8

### Patch Changes

- 8686eb38c: Throw the new `ResponseError` from `@backstage/errors`
- Updated dependencies [0434853a5]
  - @backstage/config@0.1.4

## 0.3.7

### Patch Changes

- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- Updated dependencies [0b42fff22]
  - @backstage/catalog-model@0.7.4

## 0.3.6

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- 72b96e880: Add the `presence` argument to the `CatalogApi` to be able to register optional locations.

## 0.3.5

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0

## 0.3.4

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0

## 0.3.3

### Patch Changes

- Updated dependencies [e3bd9fc2f]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.2

### Patch Changes

- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/catalog-model@0.4.0

## 0.3.1

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/catalog-model@0.3.0

## 0.3.0

### Minor Changes

- 717e43de1: Changed the getEntities interface to (1) nest parameters in an object, (2) support field selection, and (3) return an object with an items field for future extension
