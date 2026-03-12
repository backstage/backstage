---
'@backstage/backend-defaults': patch
---

Added permissions integration to the actions registry. Actions with a `permission` field are now checked against the permissions framework when listing and invoking. Denied actions are filtered from listings and return 404 on invocation.
