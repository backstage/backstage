---
'@backstage/plugin-events-node': patch
---

Fixed an issue where the event bus polling would duplicate and increase exponentially over time.
