---
'@backstage/frontend-plugin-api': patch
---

Added `PageTitle` and `usePageTitle` to the `/alpha` entry point, for adding segments to the browser's document title, along with the `DocumentTitleApi` and `documentTitleApiRef` that write the final title. Pages and sub-pages created with `PageBlueprint` and `SubPageBlueprint` now register their titles automatically.
