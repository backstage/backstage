---
'@backstage/core-components': minor
---

Declared CancelIcon explicitly on Chip component inside Select.tsx to disable onMouseDown event by default that creates the flaw of re-opening select component when user tries to remove a selected filter.
