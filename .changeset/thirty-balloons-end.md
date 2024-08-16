---
'@backstage/core-compat-api': patch
---

Added new utilities for converting legacy plugins and extensions to the new system. The `convertLegacyPlugin` option will convert an existing plugin to the new system, although you need to supply extensions for the plugin yourself. To help out with this, there is also a new `convertLegacyPageExtension` which converts an existing page extension to the new system.
