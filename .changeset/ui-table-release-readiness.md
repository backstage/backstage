---
'@backstage/ui': patch
---

Hardened the `Table`, `TablePagination`, and `useTable` stack against state changes after mount:

- `useTable` in `complete` mode now honors `paginationOptions.initialOffset`, and moves to the last available page instead of showing an empty page when the data shrinks below the current offset.
- `useTable` in `offset` and `cursor` mode now follows changes to `paginationOptions.pageSize` after mount, and no longer loses the debounced reload when the user navigates right after changing the search, filter, or sort. Navigating during that window now applies the new query from the first page.
- `Table` now correctly matches `selection.selected` keys against numeric item ids and reports selection changes using the original id type, so `selected` sets built from `item.id` work as expected.
- `Table` now exposes `aria-busy` on the grid while loading, announces empty and count-only pages in its live region, and renders the error state with `role="alert"`.
- `TablePagination` now keeps the page size selector in sync with the `pageSize` prop, keeps keyboard focus within the controls when a navigation button becomes disabled, and no longer flickers the navigation buttons to disabled while the next page is loading.
