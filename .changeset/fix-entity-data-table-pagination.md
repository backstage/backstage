---
'@backstage/plugin-catalog-react': patch
---

Enabled pagination on `EntityDataTable` by removing the `pagination: { type: 'none' }` override, so tables with many rows now paginate instead of rendering everything on a single page.
