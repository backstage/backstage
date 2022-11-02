---
'@backstage/core-components': patch
'@backstage/plugin-explore': patch
---

Adds a background to the group diagram and prevents weird scroll/zoom behavior when hovering the graph. With this fix the user can only zoom in and out while hovering the graph. If the cursor is not hovering the graph the user can scroll up and down on the page. In total this creates more consistent scrolling or zooming behavior.
