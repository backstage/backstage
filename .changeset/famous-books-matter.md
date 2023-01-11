---
'@backstage/backend-common': patch
---

Added `legacyPlugin` and the lower level `makeLegacyPlugin` wrappers that convert legacy plugins to the new backend system. This will be used to ease the future migration to the new backend system, but we discourage use of it for now.
