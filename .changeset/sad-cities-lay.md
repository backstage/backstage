---
'@backstage/plugin-techdocs-backend': patch
---

Updated CachedEntityLoader to use BackstageCredentials instead of raw tokens for cache key generation. It now uses principal-based identification (user entity ref for users, subject for services) instead of token-based keys, providing more consistent caching behavior.
