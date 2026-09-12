---
'@backstage/plugin-catalog-import': patch
---

Fixed the owner selected in the import stepper being written to the generated `catalog-info.yaml` as a display name instead of an entity reference. Groups are still suggested by their display name, but selecting one now sets a valid `spec.owner`, for example picking `My Team` results in `my-team`.
