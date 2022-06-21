# @backstage/plugin-search-react

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
