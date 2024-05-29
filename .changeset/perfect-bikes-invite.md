---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Fixed an issue in `GitlabDiscoveryEntityProvider` where the fallback branch was taking precedence over the GitLab default branch.
