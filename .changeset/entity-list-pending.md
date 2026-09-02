---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
---

Added a `pending` flag to the entity list context that is `true` only when fetching a new data set (initial load, filter or pagination change) and `false` during background refreshes. The catalog table now uses `pending` instead of `loading` for its skeleton and title spinner, so periodic and window-focus refreshes no longer flash a loading state over the existing table.
