---
'@backstage/plugin-home': patch
---

Added optional `updateName` method to `VisitsApi` interface to support updating visit names without affecting hit count. This enables plugins to update visit metadata asynchronously after the initial save.
