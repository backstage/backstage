---
'@backstage/plugin-catalog-react': patch
---

Fix bug: previously the filter would be set to "all" on page load, even if the
`initiallySelectedFilter` on the `DefaultCatalogPage` was set to something else,
or a different query parameter was supplied. Now, the prop and query parameters
control the filter as expected. Additionally, after this change any filters
which match 0 items will be disabled, and the filter will be reverted to 'all'
if they're set on page load.
