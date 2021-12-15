---
'@backstage/plugin-search': minor
---

Pagination is not supported in the search backend when permissions are enabled. To match this, the SearchModal component now hides the pagination buttons when permissions are enabled. There is also a new component, SearchResultFooter, which includes the logic to switch between a "no more results" message and the pagination buttons depending on the enabled state of the permissions system. If you're using the permissions system, you should switch to this component in your search page:

```diff
import {
  DefaultResultListItem,
  SearchBar,
  SearchFilter,
  SearchResult,
-  SearchResultPager,
+  SearchResultFooter,
  SearchType,
} from '@backstage/plugin-search';

// ...

const SearchPage = () => {
  const classes = useStyles();

  return (
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          {/* ... */}
          <Grid item xs={9}>
            <SearchResult>
              {({ results }) => (
                {/* ... */}
              )}
            </SearchResult>
-            <SearchResultPager />
+            <SearchResultFooter />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
```
