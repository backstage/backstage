---
'@backstage/ui': patch
---

Fixed SearchField `startCollapsed` prop not working correctly in Backstage UI. The field now properly starts in a collapsed state, expands when clicked and focused, and collapses back when unfocused with no input. Also fixed CSS logic to work correctly in all layout contexts (flex row, flex column, and regular containers).
