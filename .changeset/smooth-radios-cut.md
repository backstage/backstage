---
'@backstage/backend-defaults': patch
---

Add protection for scheduler service tasks REST API. The tasks endpoints may only be triggered by service tokens (not allowing user tokens to invoke the APIs).
