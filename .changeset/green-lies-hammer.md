---
'@backstage/core-components': patch
'@backstage/test-utils': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
---

Updated the layout of catalog and API index pages to handle smaller screen sizes. This adds responsive wrappers to the entity tables, and switches filters to a drawer when width-constrained. If you have created a custom catalog or API index page, you will need to update the page structure to match the updated [catalog customization](https://backstage.io/docs/features/software-catalog/catalog-customization) documentation.
