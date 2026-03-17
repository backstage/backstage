---
'@backstage/ui': patch
---

Made Checkbox `children` optional and added a dev warning when neither a visible label, `aria-label`, nor `aria-labelledby` is provided. The label wrapper div is no longer rendered when there are no children, removing the unnecessary gap.

**Affected components:** Checkbox
