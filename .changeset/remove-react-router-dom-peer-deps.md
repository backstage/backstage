---
'@backstage/theme': patch
'@backstage/integration-react': patch
'@backstage/version-bridge': patch
'@backstage/module-federation-common': patch
'@backstage/plugin-app-react': patch
'@backstage/plugin-api-docs-module-protoc-gen-doc': patch
'@backstage/plugin-auth-react': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-config-schema': patch
'@backstage/plugin-devtools-react': patch
'@backstage/plugin-example-todo-list': patch
'@backstage/plugin-home-react': patch
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-notifications': patch
'@backstage/plugin-org': patch
'@backstage/plugin-org-react': patch
'@backstage/plugin-scaffolder-node-test-utils': patch
'@backstage/plugin-signals': patch
'@backstage/plugin-signals-react': patch
'@backstage/plugin-techdocs-module-addons-contrib': patch
'@backstage/repo-tools': patch
---

Removed `react-router-dom` from peer dependencies. Routing is now provided through the `@backstage/frontend-plugin-api` RouterApi abstraction.
