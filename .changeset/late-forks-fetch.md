---
'@backstage/plugin-techdocs-backend': patch
---

Fix potential memory leak by not creating a build log transport if not given via `RouterOptions`.
