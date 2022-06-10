---
'@backstage/create-app': patch
---

It's now possible to pass result item components a `rank`, which is captured by the analytics API when a user clicks on a search result. To apply this change, update your `/packages/app/src/components/search/SearchPage.tsx` in the following way:

```diff
// ...
<SearchResult>
  {({ results }) => (
    <List>
-     {results.map(({ type, document, highlight }) => {
+     {results.map(({ type, document, highlight, rank }) => {
        switch (type) {
          case 'software-catalog':
            return (
              <CatalogSearchResultListItem
                key={document.location}
                result={document}
                highlight={highlight}
+               rank={rank}
              />
            );
          case 'techdocs':
            return (
              <TechDocsSearchResultListItem
                key={document.location}
                result={document}
                highlight={highlight}
+               rank={rank}
              />
            );
          default:
            return (
              <DefaultResultListItem
                key={document.location}
                result={document}
                highlight={highlight}
+               rank={rank}
              />
            );
        }
      })}
    </List>
  )}
</SearchResult>
// ...
```

If you have implemented a custom Search Modal or other custom search experience, you will want to make similar changes in those components.
