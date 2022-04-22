---
'@backstage/plugin-search': minor
---

The `TrackSearch` component responsible for tracking events now takes in a term property instead of relying on the search context. The reason for this is so that the `TrackSearch` component can be used both for `SearchBar` which is recommended to use when you use the `SearchContextProvider` and for `SearchBarBase` which is recommended to use if you don't use SearchContextProvider.

```diff
- <TrackSearch>
+ <TrackSearch term={value}>
    <SearchBarBase />
</TrackSearch>
```
