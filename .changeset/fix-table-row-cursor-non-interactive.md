---
'@backstage/ui': patch
---

Fixed Table rows showing a pointer cursor when not interactive. Rows now only show `cursor: pointer` when they have an `href`, are selectable, or are pressable.

**Affected components:** Table
