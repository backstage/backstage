---
'@backstage/backend-defaults': minor
---

Add support for the new WebSocket routing APIs.

Existing server upgrade listeners can coexist during migration and receive unmatched upgrades. Multiple listeners produce a warning; migrate custom upgrade handling to the router API to avoid handling the same socket twice. Upgrades handled only through Express must migrate when enabling WebSocket routes.
