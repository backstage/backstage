---
'@backstage/frontend-dynamic-feature-loader': patch
---

Keep loading other dynamic frontend plugins when one plugin's default export throws during initialization, and include the affected plugin and module in the error log.
