---
'@backstage/plugin-badges': patch
'@backstage/plugin-badges-backend': minor
---

Fixing badges-backend plugin to get a token from the TokenManager instead of parsing the request header. Hence, it's now possible to disable the authMiddleware for the badges-backend plugin to expose publicly the badges.

Implementing an obfuscation feature to protect an open badges endpoint from being enumerated. The feature is disabled by default and the change is compatible with the previous version.

**BREAKING**: createRouter now require that a tokenManager, logger, identityApi and database, are passed in as options.
