---
'@backstage/backend-dynamic-feature-service': patch
'@backstage/frontend-dynamic-feature-loader': patch
'@backstage/module-federation-common': patch
'@backstage/cli': patch
'@backstage/frontend-app-api': patch
---

Allow enabling Module Federation support in the frontend application (Module Federation host) through API only, without using the ModuleFederationPlugin at build time, nor producing specific generated bundled assets.
Module federation remotes still use ModuleFederationPlugin at build time to provide module-federation enabled remote modules, like plugin bundles or dynamic frontend plugins.
Utilities are provided to easily configure shared dependencies in both the frontend application (Module Federation host), and Module Federation remotes, while maintaining consistency between the default shared dependencies for both sides.
