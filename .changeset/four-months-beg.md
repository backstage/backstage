---
'@backstage/plugin-techdocs-backend': major
---

**BREAKING** Removed support for the legacy backend, please migrate to the new backend system. Also removed deprecated `DefaultTechDocsCollatorFactory`. Use the `@backstage/plugin-search-backend-module-techdocs` for this instead. Finally, deprecated `DocsBuildStrategy` and `TechDocsDocument` were removed, use the versions in `@backstage/plugin-techdocs-node` instead.
