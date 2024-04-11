---
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-notifications-common': patch
'@backstage/plugin-notifications-node': patch
---

Notification processor functions are now renamed to `preProcess` and `postProcess`.
Additionally, processor name is now required to be returned by `getName`.
A new processor functionality `processOptions` was added to process options before sending the notification.
