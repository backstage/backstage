---
'@backstage/filter-predicates': patch
---

Filter predicates now fail to match gracefully instead of throwing an error when an operator is given a value of an unexpected type. This applies to `$in` and `$all`/`$any` used with a non-array value, and `$hasPrefix` used with a non-string value. This makes evaluation more robust when predicates come from JSON or other sources where the value types are not guaranteed.
