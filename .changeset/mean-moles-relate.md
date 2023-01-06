---
'@backstage/plugin-search-react': minor
---

Allow customizing empty state component through `noResultsComponent` property.

Example:

```jsx
<SearchResult noResultsComponent={<>No results were found</>}>
  {({ results }) => (
    <List>
      {results.map(({ type, document }) => {
        switch (type) {
          case 'custom-result-item':
            return (
              <CustomResultListItem key={document.location} result={document} />
            );
          default:
            return (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            );
        }
      })}
    </List>
  )}
</SearchResult>
```
