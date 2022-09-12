---
'@backstage/backend-plugin-api': patch
---

Service are now scoped to either `'plugin'` or `'root'` scope. Service factories have been updated to provide dependency instances directly rather than factory functions.
