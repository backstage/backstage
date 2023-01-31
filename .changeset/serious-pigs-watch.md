---
'@backstage/plugin-techdocs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-explore': patch
'@backstage/plugin-search-react': patch
---

`ListItem` wrapper component moved to `SearchResultListItemExtension` for all `*SearchResultListItems`. This is to make sure the list only contains list elements.

Note: If you have implemented a custom result list item, you can remove the list item wrapper to avoid duplicated `<li>` elements.
