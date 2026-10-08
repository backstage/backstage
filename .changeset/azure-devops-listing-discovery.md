---
'@backstage/plugin-catalog-backend-module-azure': patch
---

Added a `discoveryMethod` option to the Azure DevOps entity provider. Set it to `listing` to discover catalog files by listing repositories through the Azure DevOps REST API instead of using Code Search. This also finds catalog files in forked repositories, which Code Search doesn't index, and works without the Code Search extension. Use the new `skipForkedRepos` option to leave forks out. Wildcards in `path` are not supported with `listing`.
