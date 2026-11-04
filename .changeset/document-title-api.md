---
'@backstage/frontend-plugin-api': patch
---

Added `usePageTitle` to the `/alpha` entry point, for customizing the browser's document title of a page or sub-page, along with the `DocumentTitleApi` and `documentTitleApiRef` that write the final title. Pages and sub-pages created with `PageBlueprint` and `SubPageBlueprint` now contribute their titles to the document title automatically.
