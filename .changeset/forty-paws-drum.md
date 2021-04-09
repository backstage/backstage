---
'@backstage/plugin-scaffolder-backend': patch
---

Fix for the `file://` protocol check in the `FilePreparer` being too strict, breaking Windows.
