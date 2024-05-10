---
'@backstage/core-app-api': patch
---

The Backstage identity session expiration check will no longer fall back to using the provider expiration. This was introduced to smooth out the rollout of Backstage release 1.18, and is no longer needed.
