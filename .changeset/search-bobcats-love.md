---
'@backstage/plugin-search-react': minor
---

The search query state now has an optional `pageLimit` property that determines how many results will be requested per page, it defaults to 25.

Examples:
_Basic_

```jsx
<SearchResults query={{ pageLimit: 30 }}>
  {results => {
    // Item rendering logic is omitted
  }}
</SearchResults>
```

_With context_

```jsx
<SearchContextProvider initialState={{ pageLimit: 30 }}>
  <SearchResults>
    {results => {
      // Item rendering logic is omitted
    }}
  </SearchResults>
</SearchContextProvider>
```
