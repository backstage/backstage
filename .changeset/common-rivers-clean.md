---
'@backstage/create-app': patch
---

Updated to include the missing core plugins in the template used with the `--next` flag. Also updated `react-router*` versions and added Jest 30-related dependencies. Finally, moved the order of `@playwright/test` so it won't trigger a file change during the creation process.
