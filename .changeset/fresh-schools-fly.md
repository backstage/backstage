---
'@backstage/plugin-catalog-backend-module-gitlab': major
---

The configuration of the `GitlabDiscoveryEntityProvider` has changed as follows:

- The configuration key `branch` is now used to define the branch from which the catalog-info should be discovered.
- The old configuration key `branch` is now called `fallbackBranch`. This value specifies which branch should be used
  if no default branch is defined on the project itself.

To migrate to the new configuration value, rename `branch` to `fallbackBranch`
