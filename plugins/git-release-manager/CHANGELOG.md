# @backstage/plugin-git-release-manager

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9

## 0.2.1

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.2.0

### Minor Changes

- a2d8922c9: Enable users to add custom features

  Add more metadata to success callbacks

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.6

## 0.1.3

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.1.2

### Patch Changes

- f915a342d: [ImgBot] Optimize images
- Updated dependencies [65e6c4541]
- Updated dependencies [5da6a561d]
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3
