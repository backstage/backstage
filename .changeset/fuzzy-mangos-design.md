---
'@backstage/plugin-techdocs': patch
---

Migrated the TechDocs alpha plugin pages to use BUI components. The index page and reader page now use BUI `Header` and `Container` instead of legacy `Page`/`Content`/`ContentHeader` wrappers. Added a `SupportButton` as a plugin header action. Changed plugin title to "Documentation" and icon to `RiArticleLine`.
