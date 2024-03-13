---
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-signals-backend': minor
'@backstage/plugin-signals-node': minor
---

**BREAKING** Type definition added to signal recipients

Update to use `{type: 'broadcast'}` instead `null` and `{type: 'user', entityRefs: ''}`
instead string entity references
