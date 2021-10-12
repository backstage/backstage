---
'@backstage/plugin-catalog-backend': patch
---

This change refactors the internal package structure to remove the `next` catalog folder that was used during the implementation and testing phase of the new catalog engine. The implementation is now the default and is therefore restructured to no longer be packaged under `next/`. This refactor does not change catalog imports from other parts of the project.
