---
'@backstage/plugin-catalog-react': patch
---

`EntityOwnerPicker` now captures a `filter` analytics event for each owner the user selects, with the selected owner entity ref as the subject and `filter: 'owners'` as an attribute.
