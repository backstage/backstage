---
'@backstage/plugin-catalog-react': minor
---

The `EntityTypePicker` now captures a `filter` analytics event when a user selects a type, with the selected type as the subject and a `filter` attribute set to `type`. No event is captured when the filter is cleared with the "all" option, or when a type is applied from the `initialFilter` prop or from URL query parameters.
