---
'@backstage/plugin-scaffolder': patch
---

Fixed a bug in the experimental Backstage UI theme for scaffolder forms where blurring an `EntityPicker` field after selecting a valid entity could silently replace the stored entity reference with the entity's display name, producing an invalid reference that only failed later in the workflow. Free text typed by the user is still committed on blur as before.
