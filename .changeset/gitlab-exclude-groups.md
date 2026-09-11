---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Added `excludeGroups` configuration option to the GitLab discovery provider. This allows excluding entire groups and their subgroups from catalog discovery. All projects under the excluded groups will be skipped during discovery. This option works alongside the existing `excludeRepos` option.
