---
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
---

Replace @keyv/redis package with @keyv/valkey since Redis is no longer open-source and Valkey is the drop-in replacement for it.
