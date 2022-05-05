---
'@backstage/plugin-catalog': patch
---

Lighthouse was reporting this button as having invalid aria- values, as the popover doesn't exist until clicked. This adds additional labels to the button to make it valid aria
