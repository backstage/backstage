---
'@backstage/core-components': patch
---

Improved `DependencyGraph` animation behavior. Topology changes (adding or removing nodes) now appear instantly without jarring intermediate layout flashes. Layout parameter changes (such as switching direction) smoothly animate existing nodes to their new positions. The settlement mechanism that determines when the graph is ready to display has been reworked to be more robust, avoiding premature settlement that could cause visible position corrections.
