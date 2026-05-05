---
'@backstage/filter-predicates': patch
---

Added an optional `resolveValue` option to `evaluateFilterPredicate` and `filterPredicateToFilterFunction`, allowing custom value resolution for filter keys. When the resolver returns an array, the filter matches if any element satisfies the filter value — enabling multi-value field semantics like those used by the catalog search table.
