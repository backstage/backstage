---
'@backstage/backend-defaults': patch
---

The scheduler now stops recurring tasks and background database maintenance before plugin shutdown hooks run. Active tasks receive their abort signal at this earlier phase, allowing plugins to drain work without new task invocations.
