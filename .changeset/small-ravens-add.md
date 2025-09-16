---
'@backstage/backend-dynamic-feature-service': patch
'@backstage/frontend-dynamic-feature-loader': patch
'@backstage/module-federation-common': patch
'@backstage/cli': patch
---

Allow enabling Module Federation support in the frontend application (Module Federation host) through API only, without any requirement of Module Federation specific configuration at build time. Built-time module federation configuration is only used for module federation remotes, like plugin bundles or dynamic frontend plugins. Utilities are provided to easily maintain consistency between the
list of shared packages added into the frontend application (Module Federation host), and the list of shared packages configured in the build of Module Federation remotes.
