---
'@backstage/config': patch
---

The `ConfigReader#get` method now always returns a deep clone of the configuration data.
