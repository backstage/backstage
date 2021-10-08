# @backstage/plugin-ilert

## 0.1.14

### Patch Changes

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3

## 0.1.11

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1

## 0.1.9

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- Updated dependencies
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog-react@0.4.2

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/plugin-catalog-react@0.4.1

## 0.1.7

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.1.5

### Patch Changes

- 4ca8e569a: chore: bump `@date-io/luxon` from 1.3.13 to 2.10.11
- Updated dependencies
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6

## 0.1.4

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.1.3

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.1.2

### Patch Changes

- f915a342d: [ImgBot] Optimize images
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
