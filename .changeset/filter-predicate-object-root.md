---
'@backstage/filter-predicates': minor
---

**BREAKING**: The `FilterPredicate` type, the zod schemas and `parseFilterPredicate` now only accept objects at the root of a predicate. Primitive values such as `"component"` or `true` were previously accepted at the root, but no API that accepts filter predicates could match them in a meaningful way. Primitive values are still allowed as values to match against properties, and as the operand of `$contains` to match arrays of primitive values, for example `{ "metadata.tags": { "$contains": "java" } }`.

A new `AnyFilterPredicate` type describes predicates that may also be primitive values at the root, which is equivalent to the previous `FilterPredicate` type. It is used for the operand of `$contains`, and is accepted by `evaluateFilterPredicate`.
