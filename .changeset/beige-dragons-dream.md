---
'@backstage/backend-defaults': minor
---

**BREAKING**: `discoveryFeatureLoader` now ignores backend plugins and modules when its package name does not follow Backstage conventions (`*-backend` & `*-backend-module-*`).
