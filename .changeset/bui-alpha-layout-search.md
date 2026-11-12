---
'@backstage/plugin-search': patch
---

The Search page in the new frontend system now lays out the search bar, filters and results with Backstage UI instead of Material UI. Its content now sits in the Backstage UI `Container`, so it lines up with the page header, and theme overrides targeting `BackstageContent` no longer apply to this page.
