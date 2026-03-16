---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Added glob pattern support for `catalog.providers.gitlab.<id>.entityFilename` in `GitlabDiscoveryEntityProvider`, including push event handling for matching added, removed, and modified files. This includes patterns such as `**/catalog-info.y?(a)ml` to discover both `.yaml` and `.yml` catalog files.
