---
'@backstage/plugin-catalog-backend-module-backstage-openapi': minor
'@backstage/backend-openapi-utils': patch
---

The merged `backstage-api` entity now fails on conflicting `components.securitySchemes` definitions instead of silently renaming them. Plugins should declare `security` per operation, and reuse the same scheme name and shape when they share an auth concept (e.g. `JWT` for the standard Backstage bearer token). Conflicts on other components (`components.schemas`, `components.parameters`, etc.) are resolved automatically by renaming the losing input's entry with the plugin's id as a prefix.

Plugin specs are merged on OpenAPI 3.1. Plugins whose spec declares a different major.minor version are skipped from the merge with an error log naming the plugin and its declared version; the aggregated entity still updates with the remaining plugins' specs.

The emitted `backstage-api` entity now declares `openapi: '3.1.0'` to match the version its content is actually on. Previously it declared `3.0.3` regardless of the plugin specs it merged, because the aggregator seeded the merge with a hand-built 3.0.3 document and `openapi-merge@1` preserved the first input's version string without checking the rest. Downstream SDK generators, scanners, and the API docs widget now see a version label consistent with the document's shapes.
