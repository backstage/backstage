---
'@backstage/ui': patch
---

`Header` tabs no longer make the page scroll horizontally when they do not fit. The tabs now stay in a single row that scrolls on its own, with a thin scrollbar. While more tabs remain to the right, the right edge of the row fades out. The fade is removed at the end of the row and while a tab has keyboard focus.

**Affected components:** Header
