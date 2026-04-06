---
'@backstage/backend-defaults': patch
---

Refactored `CacheManager` to use a local `keyvStores` module for `@keyv/*` store construction, replacing inline `require()` calls that could not be intercepted by the Vitest module mock system.
