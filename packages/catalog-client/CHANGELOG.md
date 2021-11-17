# @backstage/catalog-client

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
