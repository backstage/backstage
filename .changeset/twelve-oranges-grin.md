---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Fixed an issue in `GitlabDiscoveryEntityProvider` where entity fetching could fail for projects with special characters or that had been renamed or moved.
