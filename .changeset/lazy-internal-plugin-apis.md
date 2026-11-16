---
'@backstage/plugin-devtools': patch
---

Deferred loading of the plugin-internal utility API implementation until first use
in the new frontend system. Public utility APIs and legacy registrations remain
synchronous.
