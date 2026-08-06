---
'@backstage/config-loader': patch
---

Fix issue where `backstage-cli config:check --strict` would incorrectly reject valid configuration for open-ended object schemas, such as plain objects or map-like structures.
