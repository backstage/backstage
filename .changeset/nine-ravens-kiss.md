---
'@backstage/plugin-adr': minor
---

The `AdrSearchResultListItem` component is now a search result extension. This means that when rendered as a child of components that render search extensions, the `result`, `rank`, and `highlight` properties are optional. See the [documentation](https://backstage.io/docs/features/search/how-to-guides#how-to-render-search-results-using-extensions) for more details.
