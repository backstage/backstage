---
'@backstage/plugin-home': patch
---

Fixed widgets not being movable or resizable after saved edits. Previously, entering edit mode didn't restore `isDraggable` and `isResizable`.
