---
'@backstage/plugin-api-docs-module-protoc-gen-doc': patch
'@backstage/plugin-techdocs-module-addons-contrib': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-techdocs-addons-test-utils': patch
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-test-utils': patch
'@backstage/frontend-defaults': patch
'@backstage/integration-react': patch
'@backstage/plugin-kubernetes-cluster': patch
'@backstage/frontend-app-api': patch
'@backstage/core-compat-api': patch
'@backstage/core-components': patch
'@backstage/core-plugin-api': patch
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-permission-react': patch
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-app-visualizer': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-techdocs-react': patch
'@backstage/app-defaults': patch
'@backstage/core-app-api': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-config-schema': patch
'@backstage/plugin-notifications': patch
'@backstage/plugin-user-settings': patch
'@backstage/plugin-search-react': patch
'@backstage/create-app': patch
'@backstage/test-utils': patch
'@backstage/dev-utils': patch
'@backstage/plugin-auth-react': patch
'@backstage/plugin-home-react': patch
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-org-react': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-devtools': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-catalog': patch
'@backstage/canon': patch
'@backstage/theme': patch
'@backstage/plugin-search': patch
'@backstage/plugin-home': patch
'@backstage/plugin-app': patch
'@backstage/plugin-org': patch
---

Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

<https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>
