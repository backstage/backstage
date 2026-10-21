---
'@backstage/ui': patch
---

Fixed `Combobox` keyboard selection while filtering. With `search`, or with `items` and no `search`, the arrow keys now move through the matching options only, and Enter selects the highlighted one. Screen readers also announce the number of matching options. As with a `Combobox` without `search`, opening the list with the button or on focus shows every option until the user types. With `search.filter`, Escape and blur now restore the label of the selected option even when the filter excludes it. In that case, the number of options announced to screen readers still counts the hidden selected option.

**Affected components:** Combobox
