---
'@backstage/plugin-kubernetes-backend': patch
---

Added a `kubernetes.clusterLocatorContinueOnError` configuration option. When set to `true`, a failing cluster locator no longer causes the entire cluster list request to fail — errors are logged and clusters from the remaining successful locators are still returned. The default is `false`, preserving the existing behavior.
