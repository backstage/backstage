---
'@backstage/plugin-catalog-backend-module-backstage-openapi': minor
'@backstage/backend-openapi-utils': patch
---

Bump `openapi-merge` to `^2.0.2` across both packages and pass
`securitySchemesStrategy: 'error'` from
`plugin-catalog-backend-module-backstage-openapi` so the aggregated
`backstage-api` entity can no longer end up with an operation that
references a `securitySchemes` entry the document doesn't declare. On a
conflict between two plugins defining the same scheme name with
different shapes the merge now fails at startup rather than silently
renaming. Also adds a short "OpenAPI spec conventions" section to the
`plugin-catalog-backend-module-backstage-openapi` README for plugin
authors.

`backend-openapi-utils` only invokes `openapi-merge` with a
single-element input array (to apply a `pathModification.prepend` on
the plugin's own spec), so the strategy default change in
`openapi-merge@2` is a no-op there; its dependency bump is purely to
settle the monorepo on one version.

See [#36081](https://github.com/backstage/backstage/issues/36081) for
context.
