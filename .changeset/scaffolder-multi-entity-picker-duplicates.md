---
'@backstage/plugin-scaffolder': patch
---

Fixed `MultiEntityPicker` offering entities that were already selected after the field was remounted, for example when going back to a previous step, which let the same entity be selected twice. Selected values are now also deduplicated. Added a `ui:options.autoSelect` option, matching `EntityPicker`, so template authors can stop the highlighted option from being selected when the field loses focus.
