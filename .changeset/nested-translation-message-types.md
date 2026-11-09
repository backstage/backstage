---
'@backstage/frontend-plugin-api': patch
---

Translation functions now infer required replacement values and plural counts through message references deeper than three levels. Type inference handles cyclic references without relying on a fixed nesting depth, and count interpolation requires a numeric value even when the message has no plural variants.
