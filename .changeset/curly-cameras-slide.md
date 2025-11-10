---
'@backstage/plugin-techdocs': minor
'@backstage/plugin-techdocs-react': minor
---

Adds extension point for TechDocsReaderLayout.

Added `TechDocsReaderLayoutBlueprint` to `@backstage/plugin-techdocs-react/alpha` for creating custom TechDocs reader layouts. The blueprint provides a `loader` pattern for lazy-loading layout components and supports `withHeader` and `withSearch` config options.
