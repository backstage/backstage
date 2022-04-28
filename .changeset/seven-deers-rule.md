---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Prevent orphaned stale indices by permanently marking them for deletion so removal can be re-attempted if it failed previously
