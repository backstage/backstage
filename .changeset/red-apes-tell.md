---
'@backstage/create-app': patch
---

Components `<DefaultResultListItem>`, `<SearchBar>`, `<SearchFilter>`, and `<SearchResult>` are now deprecated in `@backstage/plugin-search` and should be imported from `@backstage/plugin-search-react` instead.

To upgrade your App, update the following in `packages/app/src/components/search/SearchPage.tsx`:

```diff
import {
- SearchBar
- SearchFilter
- SearchResult
SearchType,
- DefaultResultListItem
} from `@backstage/plugin-search`;
import {
+ DefaultResultListItem
+ SearchBar
+ SearchFilter
+ SearchResult
useSearch,
} from `@backstage/plugin-search-react`;
```
