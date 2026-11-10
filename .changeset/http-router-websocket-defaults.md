---
'@backstage/backend-defaults': minor
---

Add support for the new WebSocket routing APIs.

Existing server upgrade listeners can coexist during migration and receive unmatched upgrades. Multiple listeners produce a warning; migrate custom upgrade handling to the router API to avoid handling the same socket twice. Installing a plugin that registers a WebSocket route, such as signals, activates the server-level upgrade listener. Upgrades handled only through Express, such as the Kubernetes proxy, must migrate to this API; otherwise, unmatched upgrades receive 404 responses when this is the only server-level listener.
