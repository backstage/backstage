---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-scaffolder': patch
---

Added EntityGenericPicker to filter entities based on any other metadata like domain, capabilities, etc.,

ScaffolderPage component now takes `customFilters` as an optional prop, so that they can be used to render EntityGenericPicker for filtering entities.
