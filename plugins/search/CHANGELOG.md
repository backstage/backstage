# @backstage/plugin-search

## 0.9.0

### Minor Changes

- 2dc4818541: The pre-alpha `<SearchPageNext>`, `<SearchBarNext>`, `etc...` components have been removed. In the unlikely event you were still using/referencing them, please update to using their non-`*Next` equivalents from either `@backstage/plugin-search-react` or `@backstage/plugin-search`.

### Patch Changes

- 8809159148: Components `<DefaultResultListItem>`, `<SearchBar>` (including `<SearchBarBase>`), `<SearchFilter>` (including `.Checkbox`, `.Select`, and `.Autocomplete` static prop components), `<SearchResult>`, and `<SearchResultPager>` are now exported from `@backstage/plugin-search-react`. They are now deprecated in `@backstage/plugin-search` and will be removed in a future release.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 5388e6bdc5: Fixed a bug that could cause analytics events in other parts of Backstage to capture nonsensical values resembling search modal state under some circumstances.
- 915700f64f: In order to simplify analytics on top of the search experience in Backstage, the provided `<*ResultListItem />` component now captures a `discover` analytics event instead of a `click` event. This event includes the result rank as its `value` and, like a click, the URL/path clicked to as its `to` attribute.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/plugin-search-common@0.3.5
  - @backstage/plugin-search-react@0.2.1
  - @backstage/core-components@0.9.5
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 0.8.2-next.2

### Patch Changes

- 5388e6bdc5: Fixed a bug that could cause analytics events in other parts of Backstage to capture nonsensical values resembling search modal state under some circumstances.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/core-components@0.9.5-next.2

## 0.8.2-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/plugin-search-react@0.2.1-next.0
  - @backstage/plugin-search-common@0.3.5-next.0

## 0.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0

## 0.8.1

### Patch Changes

- 11a46863de: Fix issue with `HomePageSearchBar` requiring `SearchContext`
- bef56488ad: Introduced a `<SearchModalProvider>`, which can optionally be placed higher up in the react tree in order to allow control of search modal visibility from outside the modal itself.
- 3a74e203a8: Updated search result components to support rendering content with highlighted matched terms
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/config@1.0.1
  - @backstage/plugin-search-react@0.2.0
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-model@1.0.2

## 0.8.1-next.2

### Patch Changes

- 3a74e203a8: Updated search result components to support rendering content with highlighted matched terms
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-react@0.2.0-next.2
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1
  - @backstage/plugin-search-react@0.2.0-next.1

## 0.8.1-next.0

### Patch Changes

- 11a46863de: Fix issue with `HomePageSearchBar` requiring `SearchContext`
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0
  - @backstage/plugin-search-react@0.1.1-next.0

## 0.8.0

### Minor Changes

- 520e21aaea: The following exports has now been fully deleted from this package and can be import from `@backstage/plugin-search-react` instead.

  `SearchApi` interface.
  `searchApiRef`
  `SearchContextProvider`
  `useSearch`

  `SearchContext` has now been fully deleted from this package and is no longer exported publicly. Use `SearchContextProvider` when access to the context is needed.

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 5c062f275e: Support customizing the content of the `SidebarSearchModal`
- 38e01f2f70: Switch to `SearchDocument` type in `DefaultResultListItem` props
- 230ad0826f: Bump to using `@types/node` v16
- ab230a433f: The following exports has been moved to `@backstage/plugin-search-react` and will be removed in the next release. import from `@backstage/plugin-search-react` instead.

  - `SearchApi` interface.
  - `searchApiRef`
  - `SearchContext`
  - `SearchContextProvider`
  - `useSearch`

- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/plugin-search-react@0.1.0
  - @backstage/plugin-search-common@0.3.3

## 0.7.5-next.1

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 5c062f275e: Support customizing the content of the `SidebarSearchModal`
- 230ad0826f: Bump to using `@types/node` v16
- ab230a433f: The following exports has been moved to `@backstage/plugin-search-react` and will be removed in the next release. import from `@backstage/plugin-search-react` instead.

  - `SearchApi` interface.
  - `searchApiRef`
  - `SearchContext`
  - `SearchContextProvider`
  - `useSearch`

- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.3
  - @backstage/plugin-search-react@0.1.0-next.0

## 0.7.5-next.0

### Patch Changes

- 38e01f2f70: Switch to `SearchDocument` type in `DefaultResultListItem` props
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0

## 0.7.4

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-search-common@0.3.2

## 0.7.3

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-search-common@0.3.1

## 0.7.3-next.0

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-search-common@0.3.1-next.0

## 0.7.2

### Patch Changes

- 64b430f80d: chore(deps): bump `react-text-truncate` from 0.17.0 to 0.18.0
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/search-common@0.3.0

## 0.7.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/core-plugin-api@0.7.0

## 0.7.0

### Minor Changes

- f986369b2a: **BREAKING**: `useSearch` doesn't return anymore `open` and `toggleModal`.
  The two properties have been moved to the `useSearchModal` hook.

  ```
  import { SearchModal, useSearchModal } from '@backstage/plugin-search';

  const Foo = () => {
    const { state, setOpen, toggleModal } = useSearchModal();

    return (
      <SearchModal {...state} toggleModal={toggleModal} />
    );
  };
  ```

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/errors@0.2.1
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3
  - @backstage/theme@0.2.15
  - @backstage/types@0.1.2

## 0.6.2

### Patch Changes

- faf49ba82f: Modify modal search to clamp result length to 5 rows.
- Updated dependencies
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14

## 0.6.2-next.0

### Patch Changes

- faf49ba82f: Modify modal search to clamp result length to 5 rows.
- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.6.0

### Minor Changes

- 2f0d3d3278: Forwarding classes to HomePageSearchBar instead of using className prop. For custom styles of the HomePageSearchBar, use classes prop instead:

  ```diff
  <HomePageSearchBar
  -  className={searchBar}
  +  classes={{ root: classes.searchBar }}
    placeholder="Search"
  />
  ```

- 1dbe63ec39: The way labels are controlled on both the `<SearchFilter.Checkbox />` and
  `<SearchFilter.Select />` components has changed. Previously, the string passed
  on the `name` prop (which controls the field being filtered on) was also
  rendered as the field label. Now, if you want a label rendered, it must be
  passed on the new `label` prop. If no `label` is provided, no label will be
  rendered.

### Patch Changes

- 4aca2a5307: Introduces a `<SearchFilter.Autocomplete />` variant, which can be used as either a single- or multi-select autocomplete filter.

  This variant, as well as `<SearchFilter.Select />`, now also supports loading allowed values asynchronously by passing a function that resolves the list of values to the `values` prop. (An optional `valuesDebounceMs` prop may also be provided to control the debounce time).

  Check the [search plugin storybook](https://backstage.io/storybook/?path=/story/plugins-search-searchfilter) to see how to leverage these new additions.

- Updated dependencies
  - @backstage/core-components@0.8.6
  - @backstage/search-common@0.2.2

## 0.5.6

### Patch Changes

- 1523926507: Removes the focus from the sidebar and focus the main content after select one search result or navigate to the search result list
- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.5.6-next.0

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.5.4

### Patch Changes

- e05b9115aa: Fix missing search context issue with `HomePageSearchBar`
- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- 54ef743aa4: Introduce a `<SearchType.Tabs />` variant to display tabs for selecting search result types.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3

## 0.5.3

### Patch Changes

- 6d8e3a9651: Internal cleanup of the exports structure
- 8b532a6c02: Introduces a `<SearchType.Accordion />` variant, which operates on the same part of a search query as the existing `<SearchType />`, but in a more opinionated way (as a single-select control surface suitable for faceted search UIs).

  Check the [search plugin storybook](https://backstage.io/storybook/?path=/story/plugins-search-searchtype--accordion) to see how it can be used.

- af4980fb5d: Captures the search term entered in the SearchBarBase as a `search` event.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.9

## 0.5.2

### Patch Changes

- 3d98955c8a: Add Optional Props to Override Icon for SidebarSearch and SidebarSearchModal Component
- 49a696d720: Standardizes the component used as a search box in the search modal and in the composable home page.

  After these changes, all search boxes exported by the search plugin are based on the `<SearchBarBase />` component, and this one is based on the `<InputBase />` component of the Material UI. This means that when you use SearchBarBase or one of its derived components (like `SearchBar` and `HomePageSearchBar`) you can pass all properties accepted by InputBase that have not been replaced by the props type of those components.

  For example:

  ```jsx
  <SearchInputBase color="secondary" debouceTime={500} />
  ```

  The `color` property is inherited from `InputBaseProps` type and `debouceTime` defined by `SearchBarBaseProps`.

- 7a4bd2ceac: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2

## 0.5.1

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- 382e3a94b3: Export SearchApi interface from plugin
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.5.0

### Minor Changes

- c5b6045f36: Search Modal now relies on the Search Context to access state and state setter. If you use the SidebarSearchModal as described in the [getting started documentation](https://backstage.io/docs/features/search/getting-started#using-the-search-modal), make sure to update your code with the SearchContextProvider.

  ```diff
  export const Root = ({ children }: PropsWithChildren<{}>) => (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
  -     <SidebarSearchModal />
  +     <SearchContextProvider>
  +       <SidebarSearchModal />
  +     </SearchContextProvider>
        <SidebarDivider />
      ...
  ```

### Patch Changes

- f06ecd09a7: Add optional icon and secondaryAction properties for DefaultResultListItem component
- c5941d5c30: Add a new optional clearButton property to the SearchBar component. The default value for this new property is true.
- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2

## 0.4.18

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- 704b267e1c: Smaller UX improvements to search components such as optional autoFocus prop to SearchBar components, decreased debounce value and closing modal on link click of SearchModal, terminology updates of SearchResultPager.
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.4.17

### Patch Changes

- 5dcea2586c: Added `SearchModal` component.

  Now you can import `SearchModal` in your apps:

  ```js
  import { SearchModal } from '@backstage/plugin-search';
  ```

  You can also use the `SidebarSearchModal` component to integrate it into the sidebar of your sample apps:

  ```js
  import { SidebarSearchModal } from '@backstage/plugin-search';
  ```

- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.4.16

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/errors@0.1.4
  - @backstage/core-components@0.7.2
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1
  - @backstage/core-plugin-api@0.1.12

## 0.4.15

### Patch Changes

- 56bd537256: SearchBar component to accept optional placeholder prop
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.4.14

### Patch Changes

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4

## 0.4.13

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.4.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.4.11

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.4.10

### Patch Changes

- 7f00902d9: Add Home Page Search Bar Component, to be included in composable Home Page.
- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/core-plugin-api@0.1.7

## 0.4.9

### Patch Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/core-components@0.4.0
  - @backstage/search-common@0.2.0
  - @backstage/catalog-model@0.9.1

## 0.4.8

### Patch Changes

- 16ec8381a: Fix search page to respond to searches made from sidebar search
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.4
  - @backstage/core-components@0.3.3
  - @backstage/config@0.1.8

## 0.4.7

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- Updated dependencies
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog-react@0.4.2

## 0.4.6

### Patch Changes

- b917365cf: Change `<SearchType>` design to follow Figma and be similar to existing multi
  selects in Backstage.
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/search-common@0.1.3
  - @backstage/plugin-catalog-react@0.4.1

## 0.4.5

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.4.4

### Patch Changes

- 9266b80ab: Adding a type filter to new search
- Updated dependencies
  - @backstage/core-components@0.1.6
  - @backstage/plugin-catalog-react@0.3.1

## 0.4.3

### Patch Changes

- 078d4973e: Handle request errors properly and display them in the results list.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6

## 0.4.1

### Patch Changes

- df51a5507: Fix empty state not being displayed on missing results.
- d5db15efb: Use the `identityApi` to forward authorization headers to the `search-backend`
- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.4.0

### Minor Changes

- 5aff84759: This release represents a move out of a pre-alpha phase of the Backstage Search
  plugin, into an alpha phase. With this release, you gain more control over the
  layout of your search page on the frontend, as well as the ability to extend
  search on the backend to encompass everything Backstage users may want to find.

  If you are updating to this version of `@backstage/plugin-search` from a prior
  release, you will need to make the following modifications to your App:

  In your app package, create a new `searchPage` component at, for example,
  `packages/app/src/components/search/SearchPage.tsx` with contents like the
  following:

  ```tsx
  import React from 'react';
  import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';

  import { Content, Header, Lifecycle, Page } from '@backstage/core';
  import { CatalogResultListItem } from '@backstage/plugin-catalog';
  import {
    SearchBar,
    SearchFilter,
    SearchResult,
    DefaultResultListItem,
  } from '@backstage/plugin-search';

  const useStyles = makeStyles((theme: Theme) => ({
    bar: {
      padding: theme.spacing(1, 0),
    },
    filters: {
      padding: theme.spacing(2),
    },
    filter: {
      '& + &': {
        marginTop: theme.spacing(2.5),
      },
    },
  }));

  const SearchPage = () => {
    const classes = useStyles();

    return (
      <Page themeId="home">
        <Header title="Search" subtitle={<Lifecycle alpha />} />
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Paper className={classes.bar}>
                <SearchBar debounceTime={100} />
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.filters}>
                <SearchFilter.Select
                  className={classes.filter}
                  name="kind"
                  values={['Component', 'Template']}
                />
                <SearchFilter.Checkbox
                  className={classes.filter}
                  name="lifecycle"
                  values={['experimental', 'production']}
                />
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <SearchResult>
                {({ results }) => (
                  <List>
                    {results.map(({ type, document }) => {
                      switch (type) {
                        case 'software-catalog':
                          return (
                            <CatalogResultListItem
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
            </Grid>
          </Grid>
        </Content>
      </Page>
    );
  };

  export const searchPage = <SearchPage />;
  ```

  Then in `App.tsx`, import this new `searchPage` component, and set it as a
  child of the existing `<SearchPage />` route so that it looks like this:

  ```tsx
  import { searchPage } from './components/search/SearchPage';
  // ...
  <Route path="/search" element={<SearchPage />}>
    {searchPage}
  </Route>;
  ```

  You will also need to update your backend. For details, check the changeset for
  `v0.2.0` of `@backstage/plugin-search-backend`.

### Patch Changes

- db1c8f93b: The `<Search...Next /> set of components exported by the Search Plugin are now updated to use the Search Backend API. These will be made available as the default non-"next" versions in a follow-up release.

  The interfaces for decorators and collators in the Search Backend have also seen minor, breaking revisions ahead of a general release. If you happen to be building on top of these interfaces, check and update your implementations accordingly. The APIs will be considered more stable in a follow-up release.

- Updated dependencies [27a9b503a]
- Updated dependencies [7028ee1ca]
- Updated dependencies [db1c8f93b]
  - @backstage/catalog-model@0.8.2
  - @backstage/plugin-catalog-react@0.2.2
  - @backstage/search-common@0.1.2

## 0.3.7

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.3.6

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.3.5

### Patch Changes

- dcd54c7cd: Use `RouteRef` to generate path to search page.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.3.4

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.3.3

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.3.2

### Patch Changes

- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.3.1

### Patch Changes

- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.3.0

### Minor Changes

- b3f0c3811: Migrated to new composability API, exporting the plugin instance as `searchPlugin`, and page as `SearchPage`. Due to the old router component also being called `SearchPage`, this is a breaking change. The old page component is now exported as `Router`, which can be used to maintain the old behavior.

### Patch Changes

- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.2.7

### Patch Changes

- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.2.6

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

## 0.2.5

### Patch Changes

- 01707438b: Fix Material-UI warning for search filtering
- Updated dependencies [9c09a364f]
  - @backstage/plugin-catalog@0.2.10

## 0.2.4

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.2.3

### Patch Changes

- 6a0d7a9fb: change default size for pageSize in search result view
- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.2.2

### Patch Changes

- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5

## 0.2.1

### Patch Changes

- 475fc0aaa: Using the search field in the sidebar now navigates to the search result page.
- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3
