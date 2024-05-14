---
'@backstage/plugin-api-docs': patch
---

`DefaultApiExplorerPage` now accepts an optional `ownerPickerMode` for toggling the behavior of the `EntityOwnerPicker`, exposing a new mode `<DefaultApiExplorerPage ownerPickerMode="all" />` particularly suitable for larger catalogs. In this new mode, `EntityOwnerPicker` will display all the users and groups present in the catalog.
