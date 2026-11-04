---
'@backstage/frontend-plugin-api': patch
---

Added `PageTitle` and `usePageTitle` for adding segments to the browser's document title, and the `DocumentTitleApi` that writes the final title, available as `coreApis.documentTitle`. Pages and sub-pages created with `PageBlueprint` and `SubPageBlueprint` now register their titles automatically.
