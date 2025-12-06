---
'@backstage/core-app-api': patch
---

Added replay functionality to `AlertApiForwarder` to buffer and replay recent alerts to new subscribers, preventing missed alerts that were posted before subscription.
