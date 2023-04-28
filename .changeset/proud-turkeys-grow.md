---
'@backstage/plugin-auth-node': patch
---

Added factory for express authentication middleware

Added factory to create express middleware that will require a valid Backstage user or server token. This middleware can be applied to any express route to ensure that the request is authenticated.
