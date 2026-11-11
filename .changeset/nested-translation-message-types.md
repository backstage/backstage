---
'@backstage/frontend-plugin-api': patch
---

Improved type inference for deeply nested and cyclic translation messages. Required replacement values and plural counts are inferred at any depth, and count interpolation requires a numeric value.
