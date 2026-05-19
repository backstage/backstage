---
'@backstage/ui': patch
---

Added `searchDebounceMs` and `filterDebounceMs` options to `useTable` in `complete` mode. Both default to `0` (no debounce, no observable change for existing consumers); set them to defer the client-side filter/search/sort pipeline on large datasets without reimplementing input-layer debouncing. The controlled `search` / `onSearchChange` and `filter` / `onFilterChange` callbacks continue to fire on every change.

**Affected components:** Table
