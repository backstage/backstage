---
'@backstage/plugin-search-react': patch
'@backstage/plugin-search': patch
---

Implement AbortController request cancellation in SearchBar to prevent overlapping search requests. This change ensures that when users type quickly, previous search requests are properly canceled before new ones start.
