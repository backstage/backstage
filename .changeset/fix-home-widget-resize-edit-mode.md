---
'@backstage/plugin-home': patch
---

Fixed a bug where existing homepage widgets could not be resized or moved after re-entering edit mode on a previously saved layout. The `changeEditMode` function now updates `isResizable` and `isDraggable` on all widget layouts when entering edit mode, not only when exiting it.
