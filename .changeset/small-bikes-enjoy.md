---
'@backstage/core': minor
'@backstage/plugin-api-docs': minor
'@backstage/plugin-catalog': minor
---

Introduced generic OverflowTooltip component for cases where longer text needs to be truncated with ellipsis and show hover tooltip with full text. This is particularly useful in the cases where longer description text is rendered in table. e.g. CatalogTable and ApiExplorerTable.

Changes made in CatalogTable and ApiExplorerTable for using the OverflowTooltip component for truncating large description and showing tooltip on hover-over.
