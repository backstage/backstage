---
'@backstage/core-components': patch
---

Stop forcing `target="_blank"` in the `SupportButton` but instead use the default logic of the `Link` component, that opens external targets in a new window and relative targets in the same window.
