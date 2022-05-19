---
'@backstage/plugin-techdocs': patch
---

Fix `EntityTechdocsContent` component to use objects instead of `<Route>` elements, otherwise "outlet" will be null on sub-pages and add-ons won't render.
