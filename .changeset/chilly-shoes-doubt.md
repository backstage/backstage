---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Fixed disabling of user photo fetching. Previously, the config value wasn't propagated properly, so user photos was still being fetched despite disabled by config.
