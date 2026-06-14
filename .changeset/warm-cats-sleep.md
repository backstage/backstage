---
'@backstage/plugin-catalog-backend-module-github': patch
---

Fixed an issue where a missing GitHub App installation for one organization would crash the ingestion of all organizations. The provider now logs a warning and continues to the next org.
