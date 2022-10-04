---
'@backstage/plugin-search-react': minor
---

The `<SearchResultGroup />` component now accepts an optional property `disableRenderingWithNoResults` to disable rendering when no results are returned.
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
