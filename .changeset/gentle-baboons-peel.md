---
'@backstage/plugin-techdocs': patch
---

`TechDocsIndexPage` now accepts an optional `ownerPickerMode` for toggling the behavior of the `EntityOwnerPicker`, exposing a new mode `<TechDocsIndexPage ownerPickerMode="all" />` particularly suitable for larger catalogs. In this new mode, `EntityOwnerPicker` will display all the users and groups present in the catalog.
