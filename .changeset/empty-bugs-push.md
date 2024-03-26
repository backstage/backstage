---
'@backstage/plugin-permission-backend': patch
---

Fixed an issue where unauthorized requests were rejected by the `/authorize` endpoint, breaking unauthenticated permission flows.
