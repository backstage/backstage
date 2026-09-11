---
'@backstage/backend-defaults': patch
---

Plugin route registration now rejects paths that differ only by letter casing,
and HTTP credentials are resolved independently for each plugin service instance.
