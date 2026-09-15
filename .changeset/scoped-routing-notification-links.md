---
'@backstage/plugin-notifications': patch
---

Notification links without a leading slash now resolve from the app root. For example, `catalog/example` opens `/catalog/example` rather than becoming relative to `/notifications`. Absolute paths and external URLs retain their destinations.
