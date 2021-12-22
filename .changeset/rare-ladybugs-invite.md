---
'@backstage/plugin-auth-backend': patch
---

Fixed the fallback identity population to correctly generate an entity reference for `userEntityRef` if no token is provided.
