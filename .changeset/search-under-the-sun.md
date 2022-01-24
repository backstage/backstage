---
'@backstage/plugin-search': patch
---

Introduces a `<SearchFilter.Autocomplete />` variant, which can be used as either a single- or multi-select autocomplete filter.

This variant, as well as `<SearchFilter.Select />`, now also supports loading allowed values asynchronously by passing a function that resolves the list of values to the `values` prop. (An optional `valuesDebounceMs` prop may also be provided to control the debounce time).

Check the [search plugin storybook](https://backstage.io/storybook/?path=/story/plugins-search-searchfilter) to see how to leverage these new additions.
