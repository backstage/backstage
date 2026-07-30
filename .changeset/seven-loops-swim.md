---
'@backstage/plugin-notifications-backend': patch
---

Fixed notification recipient resolution to safely handle cyclic group relationships during group traversal, preventing endless recursion.
