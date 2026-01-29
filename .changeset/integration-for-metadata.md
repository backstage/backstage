---
'@backstage/cli': patch
'@backstage/cli-node': patch
'@backstage/plugin-catalog-backend-module-scaffolder-entity-model': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-search-backend-module-techdocs': patch
'@backstage/plugin-scaffolder-backend-module-notifications': patch
---

Added support for the new `integrationFor` metadata field in `package.json`. This field enables cross-plugin module discovery by declaring which packages a module provides integration for. Tooling and documentation systems can use this metadata to surface relevant integrations and help users discover modules that work together.
