---
'@backstage/backend-defaults': patch
---

Ensures that the limited user cookie issued for a request always represents the user authenticated on that request. A previously issued cookie belonging to a different user is now replaced during the cookie refresh, instead of being reused.
