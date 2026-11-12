---
'@backstage/frontend-plugin-api': patch
---

Added `usePageTitle`, for customizing the browser's document title of a page or sub-page, along with the `DocumentTitleApi` and its `coreApis.documentTitle` and `documentTitleApiRef` references, which write the final title. Pages and sub-pages created with `PageBlueprint` and `SubPageBlueprint` now contribute their titles to the document title automatically, and other blueprints can do the same through the new `title` option of `ExtensionBoundary` and `ExtensionBoundary.lazy`.
