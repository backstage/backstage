# @backstage/plugin-search-react

## 1.7.0

### Minor Changes

- b78f570f44d3: The SearchPage component can now be configured via app-config.yaml with default query parameters to define how it behaves when it is first loaded or reset. Check out the following example:

  ```yaml
  search:
    query:
      pageLimit: 50
  ```

  Acceptable values for `pageLimit` are `10`, `25`, `50` or `100`.

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 45f8a95e1068: Optionally initializes the search context with default settings for search queries only when the config is defined, rather than always overriding it.
- 3d63e60f3c36: Internal restructure to avoid circular imports
- Updated dependencies
  - @backstage/core-components@0.13.5
  - @backstage/core-plugin-api@1.6.0
  - @backstage/plugin-search-common@1.2.6
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.7.0-next.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/theme@0.4.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/version-bridge@1.0.5-next.0

## 1.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.6-next.1

## 1.7.0-next.1

### Minor Changes

- b78f570f44d3: The SearchPage component can now be configured via app-config.yaml with default query parameters to define how it behaves when it is first loaded or reset. Check out the following example:

  ```yaml
  search:
    query:
      pageLimit: 50
  ```

  Acceptable values for `pageLimit` are `10`, `25`, `50` or `100`.

### Patch Changes

- 45f8a95e1068: Optionally initializes the search context with default settings for search queries only when the config is defined, rather than always overriding it.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.1
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.6-next.0

## 1.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/core-components@0.13.5-next.0
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.5

## 1.6.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.4
  - @backstage/core-plugin-api@1.5.3
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.5

## 1.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.4-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.5

## 1.6.3

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1
  - @backstage/core-components@0.13.3
  - @backstage/core-plugin-api@1.5.3
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.5

## 1.6.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1-next.1
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-components@0.13.3-next.2
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.5-next.0

## 1.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1-next.0
  - @backstage/core-components@0.13.3-next.1
  - @backstage/core-plugin-api@1.5.3-next.0

## 1.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.3-next.0
  - @backstage/core-plugin-api@1.5.2
  - @backstage/theme@0.4.0
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.5-next.0

## 1.6.2

### Patch Changes

- 0134c1aa4f36: Fix accessibility issue in `SearchCheckbox` component, making it possible to use the field via keyboard.
- 2f660eb573cc: Fix SearchBar styles & update StoryBook stories for custom styles for `notchedOutline` class.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2
  - @backstage/core-components@0.13.2
  - @backstage/types@1.1.0
  - @backstage/theme@0.4.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.4

## 1.6.2-next.3

### Patch Changes

- 0134c1aa4f36: Fix accessibility issue in `SearchCheckbox` component, making it possible to use the field via keyboard.
- Updated dependencies
  - @backstage/core-components@0.13.2-next.3
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/theme@0.4.0-next.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.0-next.1
  - @backstage/core-components@0.13.2-next.2
  - @backstage/core-plugin-api@1.5.2-next.0

## 1.6.1-next.1

### Patch Changes

- 2f660eb573cc: Fix SearchBar styles & update StoryBook stories for custom styles for `notchedOutline` class.
- Updated dependencies
  - @backstage/core-components@0.13.2-next.1
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/theme@0.4.0-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.0-next.0
  - @backstage/core-components@0.13.2-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.3

## 1.6.0

### Minor Changes

- 750e45539ad: Add close button & improve search input.

  Material UI's Paper wrapping the SearchBar in the SearchPage was removed, we recommend users update their apps accordingly.

  SearchBarBase's TextField's label support added & aria-label uses label string if present, tests relying on the default placeholder value should still work unless custom placeholder was given.

- 1ce7f84b2e8: <SearchBar/> accepts InputProp property that can override keys from default

### Patch Changes

- f785f0804cd: `SearchPagination` now automatically resets the page cursor when the page limit is changed
- adb31096bc2: Fix text-overflow UI issue for Lifecycle spans in SearchFilter checkbox labels.
- Updated dependencies
  - @backstage/theme@0.3.0
  - @backstage/core-components@0.13.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.3

## 1.6.0-next.2

### Minor Changes

- 1ce7f84b2e8: <SearchBar/> accepts InputProp property that can override keys from default

### Patch Changes

- adb31096bc2: Fix text-overflow UI issue for Lifecycle spans in SearchFilter checkbox labels.
- Updated dependencies
  - @backstage/theme@0.3.0-next.0
  - @backstage/core-components@0.13.1-next.1
  - @backstage/core-plugin-api@1.5.1

## 1.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## 1.6.0-next.0

### Minor Changes

- 750e45539ad: Add close button & improve search input.

  Material UI's Paper wrapping the SearchBar in the SearchPage was removed, we recommend users update their apps accordingly.

  SearchBarBase's TextField's label support added & aria-label uses label string if present, tests relying on the default placeholder value should still work unless custom placeholder was given.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/theme@0.2.19
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.3

## 1.5.2

### Patch Changes

- b2e182cdfa4: Fixes a UI bug in search result item which rendered the item text with incorrect font size and color
- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-components@0.13.0
  - @backstage/theme@0.2.19
  - @backstage/core-plugin-api@1.5.1
  - @backstage/version-bridge@1.0.4
  - @backstage/types@1.0.2
  - @backstage/plugin-search-common@1.2.3

## 1.5.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.0-next.3
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.5.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.6-next.2
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.5.2-next.1

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-components@0.12.6-next.1
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.5.2-next.0

### Patch Changes

- b2e182cdfa4: Fixes a UI bug in search result item which rendered the item text with incorrect font size and color
- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- Updated dependencies
  - @backstage/core-components@0.12.6-next.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.2

## 1.5.1

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 553f3c95011: Correctly disable next button in `SearchPagination` on last page
- Updated dependencies
  - @backstage/core-components@0.12.5
  - @backstage/core-plugin-api@1.5.0
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.2

## 1.5.1-next.2

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 553f3c95011: Correctly disable next button in `SearchPagination` on last page
- Updated dependencies
  - @backstage/core-components@0.12.5-next.2
  - @backstage/core-plugin-api@1.5.0-next.2

## 1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.5-next.1
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/theme@0.2.18-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.2-next.0

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/core-components@0.12.5-next.0
  - @backstage/theme@0.2.17
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1

## 1.5.0

### Minor Changes

- 0eaa579f89: - Create the search results extensions, for more details see the documentation [here](https://backstage.io/docs/features/search/how-to-guides#how-to-render-search-results-using-extensions);
  - Update the `SearchResult`, `SearchResultList` and `SearchResultGroup` components to use extensions and default their props to optionally accept a query, when the query is not passed, the component tries to get it from the search context.

### Patch Changes

- 66e2aab4c4: `ListItem` wrapper component moved to `SearchResultListItemExtension` for all `*SearchResultListItems` that are exported as extensions. This is to make sure the list only contains list elements.

  Note: If you have implemented a custom result list item, we recommend you to remove the list item wrapper to avoid nested `<li>` elements.

- Updated dependencies
  - @backstage/core-components@0.12.4
  - @backstage/theme@0.2.17
  - @backstage/core-plugin-api@1.4.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1

## 1.5.0-next.1

### Patch Changes

- 66e2aab4c4: `ListItem` wrapper component moved to `SearchResultListItemExtension` for all `*SearchResultListItems` that are exported as extensions. This is to make sure the list only contains list elements.

  Note: If you have implemented a custom result list item, we recommend you to remove the list item wrapper to avoid nested `<li>` elements.

- Updated dependencies
  - @backstage/core-components@0.12.4-next.1
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1

## 1.5.0-next.0

### Minor Changes

- 0eaa579f89: - Create the search results extensions, for more details see the documentation [here](https://backstage.io/docs/features/search/how-to-guides#how-to-render-search-results-using-extensions);
  - Update the `SearchResult`, `SearchResultList` and `SearchResultGroup` components to use extensions and default their props to optionally accept a query, when the query is not passed, the component tries to get it from the search context.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.4-next.0
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1

## 1.4.0

### Minor Changes

- 6d9a93def8: Allow customizing empty state component through `noResultsComponent` property.

  Example:

  ```jsx
  <SearchResult noResultsComponent={<>No results were found</>}>
    {({ results }) => (
      <List>
        {results.map(({ type, document }) => {
          switch (type) {
            case 'custom-result-item':
              return (
                <CustomResultListItem
                  key={document.location}
                  result={document}
                />
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

### Patch Changes

- 80ce4e8c29: Small updates to some components to ensure theme typography properties are inherited correctly.
- Updated dependencies
  - @backstage/core-components@0.12.3
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1

## 1.4.0-next.2

### Minor Changes

- 6d9a93def8: Allow customizing empty state component through `noResultsComponent` property.

  Example:

  ```jsx
  <SearchResult noResultsComponent={<>No results were found</>}>
    {({ results }) => (
      <List>
        {results.map(({ type, document }) => {
          switch (type) {
            case 'custom-result-item':
              return (
                <CustomResultListItem
                  key={document.location}
                  result={document}
                />
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

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/core-components@0.12.3-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.0
  - @backstage/core-plugin-api@1.2.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.0

## 1.3.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.2

## 1.3.0

### Minor Changes

- 29ebc43a0b: The `value` of a search analytics event is now set as the total number of search results (when available)

### Patch Changes

- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- a19cffbeed: Update search links to only have header as linkable text
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/core-components@0.12.1
  - @backstage/version-bridge@1.0.3
  - @backstage/types@1.0.2
  - @backstage/plugin-search-common@1.2.0
  - @backstage/theme@0.2.16

## 1.3.0-next.4

### Patch Changes

- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- Updated dependencies
  - @backstage/core-components@0.12.1-next.4
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0
  - @backstage/plugin-search-common@1.2.0-next.3

## 1.3.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.3
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0
  - @backstage/plugin-search-common@1.2.0-next.2

## 1.3.0-next.2

### Minor Changes

- 29ebc43a0b: The `value` of a search analytics event is now set as the total number of search results (when available)

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/core-components@0.12.1-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0

## 1.2.2-next.1

### Patch Changes

- a19cffbeed: Update search links to only have header as linkable text
- Updated dependencies
  - @backstage/core-components@0.12.1-next.1
  - @backstage/version-bridge@1.0.3-next.0
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-search-common@1.1.2-next.1

## 1.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.0
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/theme@0.2.16
  - @backstage/version-bridge@1.0.2
  - @backstage/plugin-search-common@1.1.2-next.0

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.0
  - @backstage/version-bridge@1.0.2
  - @backstage/core-plugin-api@1.1.0
  - @backstage/types@1.0.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-search-common@1.1.1

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.0-next.1
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.1-next.0
  - @backstage/version-bridge@1.0.1
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/version-bridge@1.0.1
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.2.0

### Minor Changes

- 4ed1fa2480: The search query state now has an optional `pageLimit` property that determines how many results will be requested per page, it defaults to 25.

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

- bed5a1dc6e: The `<SearchResultList />` component now accepts an optional property `disableRenderingWithNoResults` to disable rendering when no results are returned.
  Possibility to provide a custom no results component if needed through the `noResultsComponent` property.

  Examples:

  _Rendering a custom no results component_

  ```jsx
  <SearchResultList
    query={query}
    noResultsComponent={<ListItemText primary="No results were found" />}
  />
  ```

  _Disable rendering when there are no results_

  ```jsx
  <SearchResultList query={query} disableRenderingWithNoResults />
  ```

- 3de4bd4f19: A `<SearchPagination />` component was created for limiting the number of results shown per search page. Use this new component to give users options to select how many search results they want to display per page. The default options are 10, 25, 50, 100.

  See examples below:

  _Basic_

  ```jsx
  import React, { useState } from 'react';
  import { Grid } from '@material-ui/core';
  import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
  import {
    SearchBarBase,
    SearchPaginationBase,
    SearchResultList,
  } from '@backstage/plugin-search-react';

  const SearchPage = () => {
    const [term, setTerm] = useState('');
    const [pageLimit, setPageLimit] = useState(25);
    const [pageCursor, setPageCursor] = useState<string>();

    return (
      <Page themeId="home">
        <Header title="Search" subtitle={<Lifecycle alpha />} />
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <SearchBarBase value={term} onChange={setTerm} />
            </Grid>
            <Grid item xs={12}>
              <SearchPaginationBase
                limit={pageLimit}
                onLimitChange={setPageLimit}
                cursor={pageCursor}
                onCursorChange={setPageCursor}
              />
            </Grid>
            <Grid item xs={12}>
              <SearchResultList query={{ term, pageLimit }} />
            </Grid>
          </Grid>
        </Content>
      </Page>
    );
  };
  ```

  _With context_

  ```jsx
  import React from 'react';
  import { Grid } from '@material-ui/core';
  import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
  import {
    SearchBar,
    SearchResult,
    SearchPagination,
    SearchResultListLayout,
    SearchContextProvider,
    DefaultResultListItem,
  } from '@backstage/plugin-search-react';

  const SearchPage = () => (
    <SearchContextProvider>
      <Page themeId="home">
        <Header title="Search" subtitle={<Lifecycle alpha />} />
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <SearchBar />
            </Grid>
            <Grid item xs={12}>
              <SearchPagination />
            </Grid>
            <Grid item xs={12}>
              <SearchResult>
                {({ results }) => (
                  <SearchResultListLayout
                    resultItems={results}
                    renderResultItem={({ document }) => (
                      <DefaultResultListItem
                        key={document.location}
                        result={document}
                      />
                    )}
                  />
                )}
              </SearchResult>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
  ```

- 6faaa05626: The `<SearchResultGroup />` component now accepts an optional property `disableRenderingWithNoResults` to disable rendering when no results are returned.
  Possibility to provide a custom no results component if needed through the `noResultsComponent` property.

  Examples:

  _Rendering a custom no results component_

  ```jsx
  <SearchResultGroup
    query={query}
    icon={<DocsIcon />}
    title="Documentation"
    noResultsComponent={<ListItemText primary="No results were found" />}
  />
  ```

  _Disable rendering when there are no results_

  ```jsx
  <SearchResultGroup
    query={query}
    icon={<DocsIcon />}
    title="Documentation"
    disableRenderingWithNoResults
  />
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.2
  - @backstage/plugin-search-common@1.1.0
  - @backstage/core-plugin-api@1.0.7
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.2.0-next.1

### Minor Changes

- 4ed1fa2480: The search query state now has an optional `pageLimit` property that determines how many results will be requested per page, it defaults to 25.

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

- bed5a1dc6e: The `<SearchResultList />` component now accepts an optional property `disableRenderingWithNoResults` to disable rendering when no results are returned.
  Possibility to provide a custom no results component if needed through the `noResultsComponent` property.

  Examples:

  _Rendering a custom no results component_

  ```jsx
  <SearchResultList
    query={query}
    noResultsComponent={<ListItemText primary="No results were found" />}
  />
  ```

  _Disable rendering when there are no results_

  ```jsx
  <SearchResultList query={query} disableRenderingWithNoResults />
  ```

- 6faaa05626: The `<SearchResultGroup />` component now accepts an optional property `disableRenderingWithNoResults` to disable rendering when no results are returned.
  Possibility to provide a custom no results component if needed through the `noResultsComponent` property.

  Examples:

  _Rendering a custom no results component_

  ```jsx
  <SearchResultGroup
    query={query}
    icon={<DocsIcon />}
    title="Documentation"
    noResultsComponent={<ListItemText primary="No results were found" />}
  />
  ```

  _Disable rendering when there are no results_

  ```jsx
  <SearchResultGroup
    query={query}
    icon={<DocsIcon />}
    title="Documentation"
    disableRenderingWithNoResults
  />
  ```

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.2-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1
  - @backstage/plugin-search-common@1.0.2-next.0

## 1.1.0

### Minor Changes

- 97f2b8f3fd: The `<SearchResult/>` component now accepts a optional `query` prop to request results from the search api:

  > Note: If a query prop is not defined, the results will by default be consumed from the context.

  Example:

  ```jsx
  import React, { useState, useCallback } from 'react';

  import { Grid, List, Paper } from '@material-ui/core';

  import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
  import {
    DefaultResultListItem,
    SearchBarBase,
    SearchResult,
  } from '@backstage/plugin-search-react';

  const SearchPage = () => {
    const [query, setQuery] = useState({
      term: '',
      types: [],
      filters: {},
    });

    const handleChange = useCallback(
      (term: string) => {
        setQuery(prevQuery => ({ ...prevQuery, term }));
      },
      [setQuery],
    );

    return (
      <Page themeId="home">
        <Header title="Search" subtitle={<Lifecycle alpha />} />
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Paper>
                <SearchBarBase debounceTime={100} onChange={handleChange} />
              </Paper>
            </Grid>
            <Grid item xs>
              <SearchResult query={query}>
                {({ results }) => (
                  <List>
                    {results.map(({ document }) => (
                      <DefaultResultListItem
                        key={document.location}
                        result={document}
                      />
                    ))}
                  </List>
                )}
              </SearchResult>
            </Grid>
          </Grid>
        </Content>
      </Page>
    );
  };
  ```

  Additionally, a search page can also be composed using these two new results layout components:

  ```jsx
  // Example rendering results as list
  <SearchResult>
    {({ results }) => (
      <SearchResultListLayout
        resultItems={results}
        renderResultItem={({ type, document }) => {
          switch (type) {
            case 'custom-result-item':
              return (
                <CustomResultListItem
                  key={document.location}
                  result={document}
                />
              );
            default:
              return (
                <DefaultResultListItem
                  key={document.location}
                  result={document}
                />
              );
          }
        }}
      />
    )}
  </SearchResult>
  ```

  ```jsx
  // Example rendering results as groups
  <SearchResult>
    {({ results }) => (
      <>
        <SearchResultGroupLayout
          icon={<CustomIcon />}
          title="Custom"
          link="See all custom results"
          resultItems={results.filter(
            ({ type }) => type === 'custom-result-item',
          )}
          renderResultItem={({ document }) => (
            <CustomResultListItem key={document.location} result={document} />
          )}
        />
        <SearchResultGroupLayout
          icon={<DefaultIcon />}
          title="Default"
          resultItems={results.filter(
            ({ type }) => type !== 'custom-result-item',
          )}
          renderResultItem={({ document }) => (
            <DefaultResultListItem key={document.location} result={document} />
          )}
        />
      </>
    )}
  </SearchResult>
  ```

  A `SearchResultList` and `SearchResultGroup` components were also created for users who have search pages with multiple queries, both are specializations of `SearchResult` and also accept a `query` as a prop as well:

  ```jsx
  // Example using the <SearchResultList />
  const SearchPage = () => {
    const query = {
      term: 'example',
    };

    return (
      <SearchResultList
        query={query}
        renderResultItem={({ type, document, highlight, rank }) => {
          switch (type) {
            case 'custom':
              return (
                <CustomResultListItem
                  key={document.location}
                  icon={<CatalogIcon />}
                  result={document}
                  highlight={highlight}
                  rank={rank}
                />
              );
            default:
              return (
                <DefaultResultListItem
                  key={document.location}
                  result={document}
                />
              );
          }
        }}
      />
    );
  };
  ```

  ```jsx
  // Example using the <SearchResultGroup /> for creating a component that search and group software catalog results
  import React, { useState, useCallback } from 'react';

  import { MenuItem } from '@material-ui/core';

  import { JsonValue } from '@backstage/types';
  import { CatalogIcon } from '@backstage/core-components';
  import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
  import {
    SearchResultGroup,
    SearchResultGroupTextFilterField,
    SearchResultGroupSelectFilterField,
  } from @backstage/plugin-search-react;
  import { SearchQuery } from '@backstage/plugin-search-common';

  const CatalogResultsGroup = () => {
    const [query, setQuery] = useState<Partial<SearchQuery>>({
      types: ['software-catalog'],
    });

    const filterOptions = [
      {
        label: 'Lifecycle',
        value: 'lifecycle',
      },
      {
        label: 'Owner',
        value: 'owner',
      },
    ];

    const handleFilterAdd = useCallback(
      (key: string) => () => {
        setQuery(prevQuery => {
          const { filters: prevFilters, ...rest } = prevQuery;
          const newFilters = { ...prevFilters, [key]: undefined };
          return { ...rest, filters: newFilters };
        });
      },
      [],
    );

    const handleFilterChange = useCallback(
      (key: string) => (value: JsonValue) => {
        setQuery(prevQuery => {
          const { filters: prevFilters, ...rest } = prevQuery;
          const newFilters = { ...prevFilters, [key]: value };
          return { ...rest, filters: newFilters };
        });
      },
      [],
    );

    const handleFilterDelete = useCallback(
      (key: string) => () => {
        setQuery(prevQuery => {
          const { filters: prevFilters, ...rest } = prevQuery;
          const newFilters = { ...prevFilters };
          delete newFilters[key];
          return { ...rest, filters: newFilters };
        });
      },
      [],
    );

    return (
      <SearchResultGroup
        query={query}
        icon={<CatalogIcon />}
        title="Software Catalog"
        link="See all software catalog results"
        filterOptions={filterOptions}
        renderFilterOption={({ label, value }) => (
          <MenuItem key={value} onClick={handleFilterAdd(value)}>
            {label}
          </MenuItem>
        )}
        renderFilterField={(key: string) => {
          switch (key) {
            case 'lifecycle':
              return (
                <SearchResultGroupSelectFilterField
                  key={key}
                  label="Lifecycle"
                  value={query.filters?.lifecycle}
                  onChange={handleFilterChange('lifecycle')}
                  onDelete={handleFilterDelete('lifecycle')}
                >
                  <MenuItem value="production">Production</MenuItem>
                  <MenuItem value="experimental">Experimental</MenuItem>
                </SearchResultGroupSelectFilterField>
              );
            case 'owner':
              return (
                <SearchResultGroupTextFilterField
                  key={key}
                  label="Owner"
                  value={query.filters?.owner}
                  onChange={handleFilterChange('owner')}
                  onDelete={handleFilterDelete('owner')}
                />
              );
            default:
              return null;
          }
        }
        renderResultItem={({ document, highlight, rank }) => (
          <CatalogSearchResultListItem
            key={document.location}
            result={document}
            highlight={highlight}
            rank={rank}
          />
        )}
      />
    );
  };
  ```

- 18f60427f2: Provides search autocomplete functionality through a `SearchAutocomplete` component.
  A `SearchAutocompleteDefaultOption` can also be used to render options with icons, primary texts, and secondary texts.
  Example:

  ```jsx
  import React, { ChangeEvent, useState, useCallback } from 'react';
  import useAsync from 'react-use/lib/useAsync';

  import { Grid, Paper } from '@material-ui/core';

  import { Page, Content } from '@backstage/core-components';
  import { SearchAutocomplete, SearchAutocompleteDefaultOption} from '@backstage/plugin-search-react';

  const OptionsIcon = () => <svg />

  const SearchPage = () => {
    const [inputValue, setInputValue] = useState('');

    const options = useAsync(async () => {
      // Gets and returns autocomplete options
    }, [inputValue])

    const useCallback((_event: ChangeEvent<{}>, newInputValue: string) => {
      setInputValue(newInputValue);
    }, [setInputValue])

    return (
      <Page themeId="home">
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Paper>
                <SearchAutocomplete
                  options={options}
                  inputValue={inputValue}
                  inputDebounceTime={100}
                  onInputChange={handleInputChange}
                  getOptionLabel={option => option.title}
                  renderOption={option => (
                    <SearchAutocompleteDefaultOption
                      icon={<OptionIcon />}
                      primaryText={option.title}
                      secondaryText={option.text}
                    />
                  )}
                />
              </Paper>
            </Grid>
          </Grid>
          {'/* Filters and results are omitted */'}
        </Content>
      </Page>
    );
  };
  ```

- ca8d5a6eae: We noticed a repeated check for the existence of a parent context before creating a child search context in more the one component such as Search Modal and Search Bar and to remove code duplication we extract the conditional to the context provider, now you can use it passing an `inheritParentContextIfAvailable` prop to the `SearchContextProvider`.

  Note: This added property does not create a local context if there is a parent context and in this case, you cannot use it together with `initialState`, it will result in a type error because the parent context is already initialized.

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- d3737da337: Reset page cursor on search filter change
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-search-common@1.0.1

## 1.1.0-next.2

### Minor Changes

- 18f60427f2: Provides search autocomplete functionality through a `SearchAutocomplete` component.
  A `SearchAutocompleteDefaultOption` can also be used to render options with icons, primary texts, and secondary texts.
  Example:

  ```jsx
  import React, { ChangeEvent, useState, useCallback } from 'react';
  import useAsync from 'react-use/lib/useAsync';

  import { Grid, Paper } from '@material-ui/core';

  import { Page, Content } from '@backstage/core-components';
  import { SearchAutocomplete, SearchAutocompleteDefaultOption} from '@backstage/plugin-search-react';

  const OptionsIcon = () => <svg />

  const SearchPage = () => {
    const [inputValue, setInputValue] = useState('');

    const options = useAsync(async () => {
      // Gets and returns autocomplete options
    }, [inputValue])

    const useCallback((_event: ChangeEvent<{}>, newInputValue: string) => {
      setInputValue(newInputValue);
    }, [setInputValue])

    return (
      <Page themeId="home">
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Paper>
                <SearchAutocomplete
                  options={options}
                  inputValue={inputValue}
                  inputDebounceTime={100}
                  onInputChange={handleInputChange}
                  getOptionLabel={option => option.title}
                  renderOption={option => (
                    <SearchAutocompleteDefaultOption
                      icon={<OptionIcon />}
                      primaryText={option.title}
                      secondaryText={option.text}
                    />
                  )}
                />
              </Paper>
            </Grid>
          </Grid>
          {'/* Filters and results are omitted */'}
        </Content>
      </Page>
    );
  };
  ```

- ca8d5a6eae: We noticed a repeated check for the existence of a parent context before creating a child search context in more the one component such as Search Modal and Search Bar and to remove code duplication we extract the conditional to the context provider, now you can use it passing an `inheritParentContextIfAvailable` prop to the `SearchContextProvider`.

  Note: This added property does not create a local context if there is a parent context and in this case, you cannot use it together with `initialState`, it will result in a type error because the parent context is already initialized.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.1-next.2
  - @backstage/core-plugin-api@1.0.6-next.2

## 1.0.2-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 1.0.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.0-next.2

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/core-components@0.10.1-next.0

## 1.0.0

### Major Changes

- 7bd7d336b2: This package has been promoted to 1.0. Read more about what it means in [New release: Backstage Search 1.0 blog](https://backstage.io/blog/2022/07/19/releasing-backstage-search-1.0)

### Patch Changes

- 60408ca9d4: Fix search pagination to reset page cursor also when a term is cleared.
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/plugin-search-common@1.0.0
  - @backstage/core-plugin-api@1.0.4
  - @backstage/theme@0.2.16

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3

## 0.2.2-next.2

### Patch Changes

- 60408ca9d4: Fix search pagination to reset page cursor also when a term is cleared.
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/theme@0.2.16-next.0
  - @backstage/plugin-search-common@0.3.6-next.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.0

## 0.2.1

### Patch Changes

- 8809159148: Components `<DefaultResultListItem>`, `<SearchBar>` (including `<SearchBarBase>`), `<SearchFilter>` (including `.Checkbox`, `.Select`, and `.Autocomplete` static prop components), `<SearchResult>`, and `<SearchResultPager>` are now exported from `@backstage/plugin-search-react`. They are now deprecated in `@backstage/plugin-search` and will be removed in a future release.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/core-components@0.9.5
  - @backstage/core-plugin-api@1.0.3

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0

## 0.2.0

### Minor Changes

- bdbe620797: **BREAKING**: `SearchContextProviderForStorybook` and `SearchApiProviderForStorybook` has been deleted. New mock implementation of the `SearchApi` introduced. If you need to mock the api we recommend you to do the following:

  ```tsx
  import {
    searchApiRef,
    MockSearchApi,
    SearchContextProvider,
  } from '@backstage/plugin-search-react';
  import { TestApiProvider } from '@backstage/test-utils';

  <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
    <SearchContextProvider>
      <Component />
    </SearchContextProvider>
  </TestApiProvider>;
  ```

### Patch Changes

- 11a46863de: Export `useSearchContextCheck` hook to check if the search context is available
- a307a14be0: Removed dependency on `@backstage/core-app-api`.
- 3a74e203a8: Updated search result components to support rendering content with highlighted matched terms
- Updated dependencies
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-search-common@0.3.4

## 0.2.0-next.2

### Patch Changes

- 3a74e203a8: Updated search result components to support rendering content with highlighted matched terms
- Updated dependencies
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.2.0-next.1

### Minor Changes

- bdbe620797: **BREAKING**: `SearchContextProviderForStorybook` and `SearchApiProviderForStorybook` has been deleted. New mock implementation of the `SearchApi` introduced. If you need to mock the api we recommend you to do the following:

  ```tsx
  import {
    searchApiRef,
    MockSearchApi,
    SearchContextProvider,
  } from '@backstage/plugin-search-react';
  import { TestApiProvider } from '@backstage/test-utils';

  <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
    <SearchContextProvider>
      <Component />
    </SearchContextProvider>
  </TestApiProvider>;
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.2-next.0

## 0.1.1-next.0

### Patch Changes

- 11a46863de: Export `useSearchContextCheck` hook to check if the search context is available
- a307a14be0: Removed dependency on `@backstage/core-app-api`.

## 0.1.0

### Minor Changes

- ab230a433f: New search package to hold things the search plugin itself and other frontend plugins (e.g. techdocs, home) depend on.

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 076b091113: api-report clean up - the package now exports following additional types:

  `SearchContextProviderProps`
  `SearchContextValue`
  `SearchContextProviderForStorybookProps`
  `SearchApiProviderForStorybookProps`

- e1de8526aa: Versioned search context managed through version-bridge
- Updated dependencies
  - @backstage/core-app-api@1.0.1
  - @backstage/core-plugin-api@1.0.1
  - @backstage/version-bridge@1.0.1
  - @backstage/plugin-search-common@0.3.3

## 0.1.0-next.0

### Minor Changes

- ab230a433f: New search package to hold things the search plugin itself and other frontend plugins (e.g. techdocs, home) depend on.

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.1
  - @backstage/core-plugin-api@1.0.1-next.0
