---
'@backstage/plugin-events-backend-module-github': patch
---

Fix the event request validation for incoming requests for GitHub webhook events
by using the raw body when verifying the signature.
