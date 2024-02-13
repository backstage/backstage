---
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-auth-node': patch
---

The helper function `makeProfileInfo` and `PassportHelpers.transformProfile`
were refactored to use the `jose` library.
