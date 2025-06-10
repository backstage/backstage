---
'@backstage/plugin-scaffolder-backend-module-catalog': patch
'@backstage/plugin-scaffolder-backend': patch
---

Most used catalog actions are now available in scaffolder.

A new scaffolder module `@backstage/plugin-scaffolder-backend-module-catalog` has been added, which provides the most
commonly used catalog actions. This module includes actions for querying, fetching and validating entities in the
catalog.

Additionally, the `catalog:fetch` action is now deprecated in favor of the new module.
