---
'@backstage/ui': patch
---

Added infinite scroll support to the `Table` component. Set `infinite: true` in `paginationOptions` when using `useTable` to enable scroll-based data loading with a load-more sentinel instead of page-based pagination. Works with all pagination modes (`complete`, `offset`, `cursor`). Supports bidirectional loading and scroll restore via `initialOffset` and the new `initialCursor` option.
