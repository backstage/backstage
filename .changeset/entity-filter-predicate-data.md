---
'@backstage/plugin-catalog-react': minor
---

The entity card, content, content layout, header, and icon link blueprints now also expose a filter given as a filter predicate object in a form that can be stored as JSON, in addition to the filter function that they already provide. Existing consumers are not affected. This lets plugins that use these blueprints be deferred when an app enables deferred loading.
