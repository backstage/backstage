---
'@backstage/backend-defaults': patch
---

Fixed a race condition in `CachedUserInfoService` where a failed request could incorrectly evict a newer cache entry for the same token. The error handler now verifies the map entry is still the same promise before deleting it.
