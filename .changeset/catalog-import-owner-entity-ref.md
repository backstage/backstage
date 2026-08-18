---
'@backstage/plugin-catalog-import': patch
---

Fixed the owner suggestions in the import stepper listing group display names instead of entity references. The selected owner is written verbatim into the generated `catalog-info.yaml`, so a group with a title or profile display name such as `My Team` produced an invalid `spec.owner` value; the suggestions are now entity references again, for example `my-team`.
