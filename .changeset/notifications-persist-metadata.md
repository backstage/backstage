---
'@backstage/plugin-notifications-backend': patch
---

Persist notification payload metadata for user notifications and broadcasts, and return it when reading notifications. Re-sending a scoped notification replaces its metadata, or clears it when the new payload omits metadata.
