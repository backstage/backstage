---
'@backstage/core-components': patch
---

Fixed the `DependencyGraph` component to avoid a jarring initial render where nodes briefly pile up at overlapping positions before animating into place. The graph content is now hidden until node measurements are complete and the layout has fully settled, then revealed at the correct positions with transitions suppressed for the first frame.

Also fixed a `containerRef` recreation chain where every graph dimension change caused the container measurement callback to be recreated and re-triggered, producing unnecessary re-renders during initial layout.
