---
'@backstage/backend-defaults': patch
---

Added permissions integration to the actions registry. Actions registered with a `permission` field are now checked against the permissions framework when listing and invoking. Denied actions are filtered from list results, and invoking a denied action returns a `404 Not Found` as if the action does not exist.
