---
'@backstage/ui': patch
---

Fixed a number of issues in `Table`, `TablePagination`, and `useTable`:

- `useTable` in `offset` mode no longer gets stuck when navigating back to the first page after mounting with an `initialOffset`.
- `useTable` in `complete` mode now honors `paginationOptions.initialOffset` instead of always starting at the first page.
- `useTable` in `complete` mode now clamps to the last page when the provided data shrinks below the current page offset, instead of showing an empty page.
- `useTable` in `complete` mode now reports a pending state again when caller-provided `data` changes back to `undefined`, for example while the caller loads new data.
- `useTable` in `offset` and `cursor` modes no longer resets to the first page and reloads when callback options such as `onSortChange` are re-created on every render.
- `useTable` in `offset` and `cursor` modes now clears a previous page load error when navigating to an already loaded page, and no longer misses updates from data sources that resolve immediately.
- The page size selector in `TablePagination` now stays in sync when the `pageSize` prop changes after mount, and an empty `pageSizeOptions` array no longer crashes the component.
- `Table` now applies controlled row selection correctly when items have numeric ids.
- The table element now exposes `aria-busy` to assistive technologies while data is loading or refreshing.
