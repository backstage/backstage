---
'@backstage/plugin-app': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-search': patch
'@backstage/plugin-search-react': patch
'@backstage/plugin-org': patch
---

The `zod` dependency has been bumped from `^3.25.76 || ^4.0.0` to `^4.0.0`, since `configSchema` requires the full Zod v4 package for JSON Schema support.
