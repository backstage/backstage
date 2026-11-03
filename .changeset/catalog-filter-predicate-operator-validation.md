---
'@backstage/plugin-catalog-backend': patch
---

Entity filter predicates that combine `$all`, `$any` or `$not` with other keys in the same object, or that give `$all` or `$any` a non-array value, are now rejected with a 400 error. Previously the extra keys were silently ignored.
