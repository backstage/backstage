---
'@backstage/plugin-auth-backend': patch
---

Bind an issued identity context to the signed limited-user proof so that plugins cannot replace it during on-behalf-of requests. Existing tokens without this context keep their current format.
