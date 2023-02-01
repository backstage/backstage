---
'@backstage/plugin-techdocs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-explore': patch
'@backstage/plugin-search-react': patch
---

`ListItem` wrapper component moved to `SearchResultListItemExtension` for all `*SearchResultListItems` that are exported as extensions. This is to make sure the list only contains list elements.

Note: If you have implemented a custom result list item, we recommend you to remove the list item wrapper to avoid nested `<li>` elements.
