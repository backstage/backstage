---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

The configuration key `branch` of the `GitlabDiscoveryEntityProvider` has been deprecated in favor of the configuration key `fallbackBranch`.
It will be reused in future release to enforce a concrete branch to be used in catalog file discovery.  
To migrate to the new configuration value, rename `branch` to `fallbackBranch`.
