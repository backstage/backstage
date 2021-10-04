# @backstage/plugin-xcmetrics

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0

## 0.2.5

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-plugin-api@0.1.8

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.2.3

### Patch Changes

- eed15251e: Enable browsing detailed build information such as host configuration, errors, warnings, metadata and a timeline for all targets
- 8ee9aa066: Internal refactoring
- Updated dependencies
  - @backstage/core-components@0.3.2
  - @backstage/theme@0.2.10

## 0.2.2

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- Updated dependencies
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6

## 0.2.1

### Patch Changes

- f6f664357: New page for browsing all builds with filtering and pagination capabilities
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5

## 0.2.0

### Minor Changes

- 616e10e94: New data in form of trend lines, status timeline and other is added to the dashboard of XCMetrics to give a better understanding of how the build system is behaving.

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
