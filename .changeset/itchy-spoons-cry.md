---
'@backstage/plugin-app-backend': patch
---

Restore the support of external config schema in the router of the `app-backend` plugin, which was broken in release `1.26.0`.
This support is critical for dynamic frontend plugins to have access to their config values.
