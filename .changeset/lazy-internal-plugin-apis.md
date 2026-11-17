---
'@backstage/plugin-devtools': patch
---

Deferred loading of the plugin-internal utility API implementation until first use
in the new frontend system. Public utility APIs and legacy registrations remain
synchronous.

**BREAKING PRODUCERS**: Custom factories overriding the internal DevTools API must
use its updated async-capable ref. These factories can still return synchronous
implementations.
