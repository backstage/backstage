---
'@backstage/plugin-catalog-react': minor
---

The entity card, content, content layout, header, and icon link blueprints now also output the filter predicate when they are given a filter predicate object, through the new `filterPredicate` data ref of each blueprint. The filter function is still output as before, so existing consumers are not affected. This lets plugins that use these blueprints be deferred.
