---
'@backstage/core-components': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-scaffolder': patch
---

Move the `CreateComponentButton` from the catalog plugin to the `core-components` & rename it to `CreateButton` to be reused inside the api-docs plugin & scaffolder plugin, but also future plugins. Additionally, improve responsiveness of `CreateButton` & `SupportButton` by shrinking them to `IconButtons` on smaller screens.
