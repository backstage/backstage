---
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-notifications-node': patch
---

A new extension point method was added that can be used to modify how the users receiving notifications
are resolved. The function passed to the extension point should only return complete user entity references
based on the notification target references and the excluded entity references. Note that the input is a list
of entity references that can be any entity kind, not just user entities.
