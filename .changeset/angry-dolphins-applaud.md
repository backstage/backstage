---
'@backstage/plugin-techdocs-backend': patch
---

Fixed an issue in DefaultTechDocsCollator where indexing of TechDocs would fail due to expired tokens, resulting in 401 Unauthorized errors. Implemented a reactive token refresh mechanism that refreshes the token upon receiving a 401 response and retries the request, ensuring continuous and error-free indexing of TechDocs.
