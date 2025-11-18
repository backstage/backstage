---
'@backstage/plugin-gateway-backend': minor
---

Added hop count tracking to prevent proxy loops. The gateway now tracks the number of proxy hops using the `backstage-gateway-hops` header and rejects requests that exceed 3 hops with a 508 Loop Detected error.
