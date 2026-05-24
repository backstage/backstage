---
'@backstage/frontend-plugin-api': patch
---

Fixed the `noHeader` option on pages created with `PageBlueprint` only taking effect for pages that use a `loader`. The option is now also honored by pages that render sub-pages with tabs and by pages without a loader, and the default page layout now hides its header when the option is set.
