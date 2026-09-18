---
'@backstage/filter-predicates': patch
---

Filter predicates that use `$in` with a non-array value, or `$hasPrefix` with a non-string value, now simply fail to match instead of throwing an error. This makes evaluation more robust when predicates come from JSON or other sources where the value types are not guaranteed.
