---
'@backstage/filter-predicates': patch
---

Filter predicates that mix operator keys (`$all`, `$any`, `$not`) with other keys are now rejected. Previously, a predicate like `{ kind: 'API', $not: { 'spec.type': 'dataset' } }` would silently drop the `kind` check. The correct form wraps conditions in `$all`.
