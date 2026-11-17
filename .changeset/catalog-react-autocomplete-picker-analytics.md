---
'@backstage/plugin-catalog-react': patch
---

`EntityAutocompletePicker`, and with it `EntityLifecyclePicker`, `EntityNamespacePicker` and `EntityTagPicker`, now captures a `filter` analytics event for each option the user selects. The event subject is the selected option and the `filter` attribute is the name of the filter.
