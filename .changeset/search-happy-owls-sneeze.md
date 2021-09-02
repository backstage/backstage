---
'@backstage/search-common': minor
'@backstage/plugin-search': patch
'@backstage/plugin-search-backend': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-pg': minor
'@backstage/plugin-search-backend-node': patch
---

Implement optional `pageCursor` based paging in search.

To use paging in your app, add a `<SearchResultPager />` to your
`SearchPage.tsx`.
