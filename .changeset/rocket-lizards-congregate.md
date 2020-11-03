---
'@backstage/plugin-catalog': minor
---

The URL path for a catalog entity has changed,

- from: `/catalog/:kind/:optionalNamespaceAndName`
- to: `/catalog/:namespace/:kind/:name`

Redirects are in place, so disruptions for users should not happen.
