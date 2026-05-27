---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog': patch
---

The entity list provider now fetches the entity list and the total count as two separate parallel requests when using cursor or offset pagination. The list query skips the expensive count computation (using `totalItems: 'exclude'`), so the table populates immediately. The count arrives asynchronously and updates the title. A new `totalItemsLoading` field is exposed on `EntityListContextProps` so consumers can distinguish a stale count from a fresh one.

The catalog table now keeps stale rows visible during filter changes and page navigation instead of replacing the entire table body with a spinner. The full-table spinner is only shown on the very first load when no data exists yet. The entity count in the title is dimmed while the count is refreshing, and a small spinner appears next to the title while rows are loading.
