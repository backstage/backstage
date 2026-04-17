---
'@backstage/ui': patch
---

Added `renderPopover` prop to Menu, MenuListBox, and MenuAutocompleteListbox components to fix silent failure when used inside another Popover's overlay layer. Also added `autoFocus` prop to MenuAutocompleteListbox for search input auto-focus control.

Fixes #33965

**Affected components:** Menu, MenuListBox, MenuAutocompleteListbox
