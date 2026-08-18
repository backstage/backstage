---
'@backstage/connections': patch
---

Added the `declareConnection` helper, which plugins and modules call inside their `register` callback to declare which connection types they use.
