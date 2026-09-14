---
'@backstage/ui': patch
---

Fixed an issue where using `PluginHeader` with `FullPage` caused the page to be unexpectedly scrollable. The `--bui-header-height` CSS variable now correctly accounts for the header's `margin-bottom`, preventing the layout from overflowing the viewport.
