---
'@backstage/plugin-catalog-react': patch
---

The `EntityKindPicker` now captures a `filter` analytics event when a user selects a kind. The event subject is the selected kind, and the `filter` attribute is set to `kind`. No event is captured for the initial selection or when the kind comes from the URL.
