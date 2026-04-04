---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

The `EntityKindPicker` component now accepts an optional
`allFilterEnabled` prop that adds an "all" option to the kind dropdown.
Selecting it clears the kind filter and removes the `kind` query
parameter, making it easy to search across the entire catalog. The
`@backstage/plugin-catalog` package also exposes the corresponding
`allFilterEnabled` configuration for the kind filter blueprint used in
the catalog page.
