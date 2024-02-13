---
'@backstage/plugin-kubernetes-backend': patch
---

Backstage will log a warning whenever duplicate cluster names are detected --
even if clusters sharing the same name come from separate locators.
