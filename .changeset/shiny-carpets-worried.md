---
'@backstage/core-compat-api': minor
---

**BREAKING**: The `namespace` parameter for API's is now defaulted to the `pluginId` which was discovered. This means that if you're overriding API's by using ID's directly, they might have changed to include the plugin ID too.
