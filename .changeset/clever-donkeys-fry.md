---
'@backstage/config': minor
---

The `ConfigReader` now treats `null` values as present but explicitly undefined, meaning it will not fall back to the next level of configuration.
