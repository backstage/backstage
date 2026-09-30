---
'@backstage/plugin-techdocs-backend': patch
---

Fixed TechDocs asset caching on reused HTTP connections to avoid listener leaks and cross-request response corruption. Existing cached assets are refreshed automatically.
