---
'@backstage/plugin-search': patch
---

Introduces a `<SearchFilter.Autocomplete />` variant, which can be used as either a single- or multi-select autocomplete filter.

This variant, as well as `<SearchFilter.Select />`, now also supports loading allowed values asynchronously with a new `asyncValues` prop, which takes an asynchronous function that resolves to the list of values (an optional `asyncDebounce` prop may also be provided).

Check the [search plugin storybook](https://backstage.io/storybook/?path=/story/plugins-search-searchfilter) to see how to leverage these new additions.
