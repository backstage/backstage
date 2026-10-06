---
'@backstage/ui': patch
---

Fixed `Combobox` keyboard selection while filtering. With `search`, or when filtering `items`, pressing the arrow keys now moves through the matching options only, and Enter selects the highlighted one. Screen readers also announce the number of matching options. As with a `Combobox` without `search`, opening the list with the button or on focus shows every option until the user types. With `search.filter`, the selected option stays in the list while filtering, so Escape and blur restore its label.

**Affected components:** Combobox
