---
'@backstage/ui': patch
---

`Header` tabs no longer make the page scroll horizontally when they do not fit. The tabs now stay in a single row that scrolls on its own, with a visible scrollbar. When more tabs are hidden on a side, that edge of the row fades out. The fade is removed while a tab has keyboard focus. The row scrolls to show the active tab when the page loads and whenever the active tab changes. With a mouse or other precise pointer, a scroll button also appears on each side that has hidden tabs. Small touch screens show only the fade. The buttons respect the reduced motion setting. Screen readers do not announce them, because every tab is still reachable with the keyboard.

**Affected components:** Header
