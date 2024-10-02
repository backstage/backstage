---
'@backstage/core-components': patch
'@backstage/plugin-auth-node': patch
---

Fix authentication error handling using redirect flow via `enableExperimentalRedirectFlow` config. If an error is caught during authentication, the user is redirected back to app origin with `error` query parameter containing the error message.
