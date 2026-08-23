---
'@backstage/plugin-catalog-import': patch
---

Fixed the import stepper's owner autocomplete writing the group's display title (e.g. "My Team") into the generated `catalog-info.yaml` instead of a valid entity ref (e.g. "group:default/my-team"). Group options are now resolved back to their entity ref before the value is used to generate the pull request content and preview, while still showing the friendly title in the dropdown.
