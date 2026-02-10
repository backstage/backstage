---
'@backstage/plugin-catalog-react': minor
---

**BREAKING ALPHA**: All of the predicate types and functions have been moved to the `@backstage/filter-predicates` package.

When moving into the more general package, they were renamed as follows:

- `EntityPredicate` -> `FilterPredicate`
- `EntityPredicateExpression` -> `FilterPredicateExpression`
- `EntityPredicatePrimitive` -> `FilterPredicatePrimitive`
- `entityPredicateToFilterFunction` -> `filterPredicateToFilterFunction`
- `EntityPredicateValue` -> `FilterPredicateValue`
