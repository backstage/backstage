---
'@backstage/core-components': patch
---

Removed CSS transitions from `DependencyGraph` nodes and edges to eliminate jarring animation artifacts when the graph layout changes. The graph now renders layout changes instantly.
