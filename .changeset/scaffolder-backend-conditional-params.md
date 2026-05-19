---
'@backstage/plugin-scaffolder-backend': patch
---

The parameter schema endpoint now passes through the `if` field from parameter step entries, enabling conditional step visibility in the scaffolder wizard frontend. Backend validation for task creation and dry-run endpoints now skips parameter schema validation for steps whose `if` condition evaluates to false.
