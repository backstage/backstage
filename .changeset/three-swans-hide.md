---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-search-backend': patch
---

Fixed a `Hooks cannot be defined inside tests` error that was occurring when using the plugin in a jest test.
