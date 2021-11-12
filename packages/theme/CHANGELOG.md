# @backstage/theme

## 0.2.13

### Patch Changes

- c11a37710a: Added a warning variant to `DismissableBanner` component. If you are using a
  custom theme, you will need to add the optional `palette.banner.warning` color,
  otherwise this variant will fall back to the `palette.banner.error` color.

## 0.2.12

### Patch Changes

- 40cfec8b3f: More theme API cleanup
- a15d028517: More API fixes: mark things public, add docs, fix exports

## 0.2.11

### Patch Changes

- 75bc878221: Internal refactor to avoid importing all of `@material-ui/core`.

## 0.2.10

### Patch Changes

- 6b1afe8c0: Add a configurable `palette.bursts.gradient` property to the Backstage theme, to support customizing the gradients in the `ItemCard` header.

## 0.2.9

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes

## 0.2.8

### Patch Changes

- e7c5e4b30: Update installation instructions in README.

## 0.2.7

### Patch Changes

- 7b8272fb7: Remove extra bottom padding in InfoCard content

## 0.2.6

### Patch Changes

- 931b21a12: Replace the link color in dark theme

## 0.2.5

### Patch Changes

- 4618774ff: Changed color for Add Item, Support & Choose buttons with low contrast/readability in dark mode

## 0.2.4

### Patch Changes

- 2089de76b: Deprecated `ItemCard`. Added `ItemCardGrid` and `ItemCardHeader` instead, that can be used to compose functionality around regular Material-UI `Card` components instead.

## 0.2.3

### Patch Changes

- c810082ae: Updates warning text color to align to updated `WarningPanel` styling

## 0.2.2

### Patch Changes

- 1665ae8bb: Add a little more padding in dense tables

## 0.2.1

### Patch Changes

- 4577e377b: Improve styling of outlined chips in dark mode.

## 0.2.0

### Minor Changes

- 0d4459c08: Tweak dark mode colors

### Patch Changes

- ae5983387: Fix banner position and color

  This PR closes: #2245

  The "fixed" props added to control the position of the banner. When it is set to true the banner will be shown in bottom of that page and the width will be based on the content of the message.

  ![](https://user-images.githubusercontent.com/15106494/93765685-999df480-fc15-11ea-8fa5-11cac5836cf1.png)

  ![](https://user-images.githubusercontent.com/15106494/93765697-9e62a880-fc15-11ea-92af-b6a7fee4bb21.png)
