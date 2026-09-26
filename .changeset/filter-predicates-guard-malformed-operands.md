---
'@backstage/filter-predicates': patch
---

Filter predicates now throw a clear error when an operator is given an operand of an unexpected type, instead of silently failing to match. This applies to `$in`, `$all`, and `$any` used with a non-array operand, and `$hasPrefix` used with a non-string operand. Mistakes in predicates now surface immediately rather than looking like zero matches.
