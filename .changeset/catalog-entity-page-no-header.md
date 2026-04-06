---
'@backstage/plugin-catalog': patch
---

Disabled the default page layout header for the catalog entity page in the new frontend system. The entity page already renders its own header through the `EntityHeader` extension, so the page layout header was redundant.
