---
'@backstage/plugin-catalog-backend': patch
---

Entity lifecycle and owner are now indexed by the `DefaultCatalogCollator`. A `locationTemplate` may now optionally be provided to its constructor to reflect a custom catalog entity path in the Backstage frontend.
