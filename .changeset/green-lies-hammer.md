---
'@backstage/core-components': patch
'@backstage/test-utils': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
---

Build a general TablePage component to enforce a more responsive layout for the Catalog & API page. Filters are now wrapped in an accordion on smaller screens, enabling the user to see & interact better with the table. Additionally, a test was added, to check that the responsive wrapping is working for the Catalog page.
