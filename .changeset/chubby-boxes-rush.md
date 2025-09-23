---
'@backstage/plugin-catalog-react': patch
---

Use Presentation API for owner display and sorting in EntityOwnerPicker (owners-only), with default presentation fallback. Avoids fetching full entities from catalog to prevent scalability issues in large catalogs.
