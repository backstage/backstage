---
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-backend': patch
'@backstage/techdocs-common': patch
---

Adding in-context search to TechDocs Reader component. Using existing search-backend to query for indexed search results scoped into a specific entity's techdocs. Needs TechDocsCollator enabled on the backend to work.

Adding extra information to indexed tech docs documents for search.
